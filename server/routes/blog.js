const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/', ctrls.getBlogs)
router.get('/one/:bid', ctrls.getBlog)

router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.put('/likes/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislikes/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.delete('/:bid', [verifyAccessToken], ctrls.deleteBlog)
router.put('/image/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)





module.exports = router