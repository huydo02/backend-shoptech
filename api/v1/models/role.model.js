const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    }, {
    timestamps: true,
}
);
const Roles = mongoose.model('roles', schema);

module.exports = Roles;