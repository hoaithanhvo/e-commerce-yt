const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')
const { log } = require('console')
const { users } = require('../ultils/constant')



// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname } = req.body
//     if (!email || !password || !lastname || !firstname)
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs'
//         })

//     const user = await User.findOne({ email })
//     if (user) throw new Error('User has existed')
//     else {
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
//         })
//     }
// })

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed')
    else {
        const token = makeToken()
        // const emailedited = btoa(email) + '@' + token
        const emailedited = Buffer.from(email).toString('base64') + '@' + token;
        const username = `${firstname}_${lastname}`
        const newUser = await User.create({
            email: emailedited, password, firstname, lastname, mobile, username
        })
        if (newUser) {
            const html = `<h2>Register code:</h2><br /><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account in Digital World' })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited })
        }, [300000])

        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active account' : 'Something went wrong, please try later'
        })
    }
})

// const finalRegister = asyncHandler(async (req, res) => {
//     // const cookie = req.cookies
//     const { token } = req.params
//     const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
//     if (notActivedEmail) {
//         notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
//         notActivedEmail.save()
//     }
//     return res.json({
//         success: notActivedEmail ? true : false,
//         mes: notActivedEmail ? 'Register is Successfully. Please go login.' : 'Some went wrong, please try later'
//     })
// })

const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        const base64EncodedEmail = notActivedEmail?.email?.split('@')[0];
        const decodedEmail = Buffer.from(base64EncodedEmail, 'base64').toString('utf-8');
        notActivedEmail.email = decodedEmail;
        await notActivedEmail.save();
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register is Successfully. Please go login.' : 'Some went wrong, please try later'
    });
});

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    })
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})



const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
// client guiwr mail dang ki 
// server check gmail cos hop le khogn 
// khong thi bao loi
// gui mail kem link password 
// bao cho client check mail, click vaof link 
// client sex guwi api kem theo token
// check token co giong token server da guiwr khoong


const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Check your mail please.' : 'Something went wrong. Please try later'
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})



const getUsers = asyncHandler(async (req, res) => {
    try {
        const queries = { ...req.query }
        // Tách các trường đặc biệt ra khỏi query
        const excludeFields = ['limit', 'sort', 'page', 'fields']
        excludeFields.forEach(el => delete queries[el])

        // Format lại các operators cho đúng cú pháp mongoose
        let queryString = JSON.stringify(queries)
        queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
        const formatedQueries = JSON.parse(queryString)
        let colorQueryObject = {}
        if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }

        if (req.query.q) {
            delete formatedQueries.q
            formatedQueries['$or'] = [
                { firstname: { $regex: req.query.q, $options: 'i' } },
                { lastname: { $regex: req.query.q, $options: 'i' } },
                { email: { $regex: req.query.q, $options: 'i' } },
            ]
        }
        let queryCommand = User.find(formatedQueries)

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            queryCommand = queryCommand.sort(sortBy)
        }

        // Fields limiting 
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            queryCommand = queryCommand.select(fields)
        }

        // Pagination phân trang 
        const page = +req.query.page || 1
        const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
        const skip = (page - 1) * limit
        queryCommand.skip(skip).limit(limit)

        // Execute query
        const response = await queryCommand.exec();
        const counts = await User.countDocuments(formatedQueries);

        res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get products',
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


const deleteUsers = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})
const updateUsers = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error("Miss inputs")
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'No user update'
    })
})
const updateUsersByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("Miss inputs")
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? response : 'No user update'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs123')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body
    if (!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, {
            $set: {
                "cart.$.quantity": quantity,
                "cart.$.price": price,
                "cart.$.thumbnail": thumbnail,
                "cart.$.title": title,
            }
        }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart' : 'Some thing went wrong'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart' : 'Some thing went wrong'
        })
    }
})
const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (!alreadyProduct) return res.status(200).json({
        success: true,
        mes: 'Updated your cart'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart' : 'Some thing went wrong'
    })
})
const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Some thing went wrong'
    })
})
const updateUserNew = asyncHandler(async (req, res) => {
    const { email, firstname, lastname, mobile, address } = req.body;
    console.log(email);
    // Kiểm tra xem có thiếu thông tin không
    if (!email || !lastname || !firstname || !mobile || !address) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs64'
        });
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist');
        }

        // Cập nhật thông tin người dùng
        user.email = email;
        user.address = address;
        user.firstname = firstname;
        user.lastname = lastname;
        user.mobile = mobile;

        // Lưu thông tin người dùng đã cập nhật
        await user.save();

        return res.json({
            success: true,
            mes: 'User information updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mes: 'Failed to update user information'
        });
    }
});

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUsers,
    updateUsers,
    updateUsersByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    createUsers,
    removeProductInCart,
    updateUserNew


} 