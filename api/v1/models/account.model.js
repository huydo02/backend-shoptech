const mongoose = require('mongoose');
const generate = require('../../../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateRandomString(20),
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    }, {
    timestamps: true,
}
);
const Accounts = mongoose.model('accounts', schema);

module.exports = Accounts;