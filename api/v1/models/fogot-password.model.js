const mongoose = require('mongoose');
const generate = require('../../../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180
        },
    },
    {
        timestamps: true,
    }
);
const ForgotPassword = mongoose.model('forgot-passwords', schema);

module.exports = ForgotPassword;