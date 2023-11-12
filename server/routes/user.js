const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/', [verifyAccessToken], ctrls.deleteUsers)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)

router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUsersByAdmin)
router.put('/address/:uid', [verifyAccessToken], ctrls.updateUserAddress)






module.exports = router