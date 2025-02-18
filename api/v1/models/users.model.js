const mongoose = require('mongoose');
const generate = require('../../../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: String,
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active",
        },
        chat: [{
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String, required: true },
        }],
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    }, {
    timestamps: true,
}
);
const Users = mongoose.model('users', schema);

module.exports = Users;