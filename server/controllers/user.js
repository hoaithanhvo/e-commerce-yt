const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateRefreshToken, generateAccessToken } = require("../middlewares/jwt")


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inpduts'
        })

    const user = await User.findOne({ email })

    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
        })
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inpduts'
        })

    const response = await User.findOne({ email })
    // plain object
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi respone 
        const { password, role, ...userData } = response.toObject()
        //Tạo accessToken
        const accessToken = generateAccessToken(response._id)
        //Tạo refresh token
        const refreshToken = generateRefreshToken(response._id, role)
        //Lưu refresh vào database
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true })
        //Lưu refresh vào cookie
        res.cookie('refreshtoken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            sucess: true,
            accessToken,

            userData
        })
    }
    else {
        throw new Error("Invaild khong hop le ")
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user


    const user = await User.findById(_id).select('-password -refreshToken -role -firstname')
    return res.status(200).json({
        sucess: false,
        rs: user ? user : "use not fuond"
    })


})
module.exports = {
    register,
    login,
    getCurrent

}