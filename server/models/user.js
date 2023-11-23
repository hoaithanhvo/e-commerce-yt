const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const { type } = require('os');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    firstname: {
        type: String,
        required: true,
        unique: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [1945, 1979],
        default: 1979,
    },
    // giỏ hàng 
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String
    }],
    address: String,
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    // khóa chức năng người dùng 
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    },
    registerToken: {
        type: String
    },

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

//Export the model
module.exports = mongoose.model('User', userSchema);