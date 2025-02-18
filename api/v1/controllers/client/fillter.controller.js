const CategoriesModel = require("../../models/categories.model");
const productModel = require("../../models/product.model");


const searchHelper = require('../../../../helpers/search.helper');
const newPrice = require("../../../../helpers/newPrice.helper");


module.exports.index = async (req, res) => {
    try {
        let sort = {};
        if (req.query.filter) {
            const [key, order] = req.query.filter.split('-');
            sort[key] = order;
        } else {
            sort.position = 'desc';
        }
        const regex = new RegExp(req.query.query, "i");

        let find = {
            deleted: false,
            status: "active",
            title: regex
        };
        console.log(req.query);

        const products = await productModel.find(find).sort(sort);
        const newProduct = newPrice.newPriceProducts(products);
        console.log(newProduct)
        if (newProduct.length === 0) {
            return res.json({
                status: 'false',
                message: 'Không tìm thấy sản phẩm nào',
                keyword: req.query.query
            })
        }
        return res.json({
            status: 'success',
            products: newProduct,
            keyword: req.query.query
        })
    } catch (error) {
        res.json({
            status: 'false',
            message: 'Lỗi server'
        })
    }

}
module.exports.live = async (req, res) => {

    // console.log(req.query.live)

    if (req.query.live) {
        const regex = new RegExp(req.query.live, "i");
        const product = await productModel.find({
            status: "active",
            deleted: false,
            title: regex,

        });
        const newProduct = newPrice.newPriceProducts(product);
        // console.log(product)
        res.json({
            status: 200,
            data: newProduct
        });

    }

}