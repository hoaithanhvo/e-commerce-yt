const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)

    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : "khoong cos"
    })

})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : "Cannot get product"
    })

})
const getProducts = asyncHandler(async (req, res) => {
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
        if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
        if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
        if (queries?.color) {
            delete formatedQueries.color
            const colorArr = queries.color?.split(',')
            const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
            colorQueryObject = { $or: colorQuery }
        }
        let queryObject = {}
        if (queries?.q) {
            delete formatedQueries.q
            queryObject = {
                $or: [
                    { color: { $regex: queries.q, $options: 'i' } },
                    { title: { $regex: queries.q, $options: 'i' } },
                    { category: { $regex: queries.q, $options: 'i' } },
                    { brand: { $regex: queries.q, $options: 'i' } },
                    // { description: { $regex: queries.q, $options: 'i' } },
                ]
            }
        }
        const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject }
        let queryCommand = Product.find(qr)

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
        const counts = await Product.countDocuments(qr);

        res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products',
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


const updateProducts = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : "Cannot update product"
    })

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProducts = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProducts ? true : false,
        deleteProducts: deleteProducts ? deleteProducts : "Cannot update product"
    })

})
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) throw new Error('Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);

    if (alreadyRating) {
        // Update star & comment
        const updatedRatings = ratingProduct.ratings.map(el => {
            if (el.postedBy.toString() === _id) {
                el.star = star;
                el.comment = comment;
                el.updatedAt = updatedAt;
            }
            return el;
        });
        ratingProduct.ratings = updatedRatings;
    } else {
        // Add star & comment
        ratingProduct.ratings.push({ star, comment, postedBy: _id, updatedAt });
    }

    // Sum ratings
    const ratingCount = ratingProduct.ratings.length;
    const sumRatings = ratingProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
    ratingProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;

    await ratingProduct.save();

    return res.status(200).json({
        success: true,
        updatedProduct: ratingProduct,
    });
});
const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing inputs')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProducts,
    deleteProduct,
    ratings,
    uploadImagesProduct
}