const mongoose = require('mongoose');
// const generate = require('../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        // user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number,
            }
        ],
        status: {
            type: String,
            default: "pending"
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);
const Orders = mongoose.model('orders', schema);

module.exports = Orders;