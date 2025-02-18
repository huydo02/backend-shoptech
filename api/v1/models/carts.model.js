const mongoose = require('mongoose');
const generate = require('../../../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
            }
        ]
    }, {
    timestamps: true,
}
);
const Carts = mongoose.model('carts', schema);

module.exports = Carts;