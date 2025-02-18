// const Product = mongoose.model('Product', {
//     tittle: String,  // Sửa thành "tittle" thay vì "title"
//     price: String,
//     thumbnail: String
// }, 'product');  // Đặt tên collection rõ ràng là "product"
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const schema = new mongoose.Schema(
    {
        title: String,
        category: {
            type: String,
            default: "",
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        slug: { type: String, slug: "title", unique: true },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now,
            }
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        // deletedAt: Date,
        deletedBy: {
            account_id: String,
            deletedAt: Date,
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date,
            },
        ]
    }, {
    timestamps: true,
}
);
const Products = mongoose.model('products', schema);

module.exports = Products;