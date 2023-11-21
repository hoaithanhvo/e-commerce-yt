const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', ctrls.register)
router.get('/finalRegister/:token', ctrls.finalRegister)

router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/:uid', [verifyAccessToken], ctrls.deleteUsers)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUsersByAdmin)
router.put('/address/:uid', [verifyAccessToken], ctrls.updateUserAddress)
router.put('/finalregister/:token', ctrls.finalRegister)
router.post('/mock', ctrls.createUsers)
router.delete('/remove-cart/:pid/:color', [verifyAccessToken], ctrls.removeProductInCart)









module.exports = router