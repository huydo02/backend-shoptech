const mongoose = require('mongoose');
const generate = require('../../../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        // user_id: String,
        cart_id: String,
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
const Builds = mongoose.model('builds', schema);

module.exports = Builds;