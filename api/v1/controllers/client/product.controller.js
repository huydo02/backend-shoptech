const productModel = require("../../models/product.model");
const CategoriesModel = require("../../models/categories.model");
const newPrice = require("../../../../helpers/newPrice.helper");
module.exports.product = async (req, res) => {
    let live = req.query.live;
    // console.log(live)
    let find = {
        deleted: false,
        status: "active",
    };
    if (req.query.live) {
        find.title = live
    }
    const product = await productModel.find(find);
    const newProduct = newPrice.newPriceProducts(product);

    res.json({
        status: 200,
        data: newProduct
    });

}

module.exports.slugCategory = async (req, res) => {
    // console.log("okoskdofkaosdkfoas")

    try {
        let sort = {};
        if (req.query.filter) {
            const [key, order] = req.query.filter.split('-');
            sort[key] = order;
        } else {
            sort.position = 'desc';
        }

        const category = await CategoriesModel.findOne({ slug: req.params.slugCategory, deleted: false });
        const getSubCategory = async (parentId) => {
            const subs = await CategoriesModel.find({
                parent_id: parentId,
                status: "active",
                deleted: false,
            });
            let allSub = [...subs];

            for (const sub of subs) {
                const childs = await getSubCategory(sub.id);

                allSub = allSub.concat(childs);
            }
            return allSub;
        };

        const listSubCategory = await getSubCategory(category.id);

        const listSubCategoryId = listSubCategory.map(item => item.id);

        const products = await productModel.find({
            category: { $in: [category.id, ...listSubCategoryId] },
            deleted: false,
        })
            .sort(sort);
        const newProduct = newPrice.newPriceProducts(products);
        // console.log(newProduct);
        res.json({
            status: "success",
            newProduct: newProduct,
        });
    } catch (error) {
        // res.redirect("/products");
        res.json({
            status: "false",
            message: "không tìm thấy sản phẩm nào.",
        });

    }
}

module.exports.detail = async (req, res) => {


    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active",
        }
        const product = await productModel.findOne(find);
        product._doc.priceNew = newPrice.newPriceProductDetail(product);

        const sameProducts = await productModel.find({
            _id: { $ne: product._id },
            deleted: false,
            category: product.category,
            status: "active",
        }).limit(5);
        const newProduct = sameProducts.map(item => {
            item._doc.priceNew = (item.price - (item.price * item.discountPercentage / 100)).toFixed(0);
            return item;
        });
        console.log(newProduct)
        res.status(200).json({
            success: 'oke',
            product: product,
            sameProducts: sameProducts,
        });
    } catch (error) {
        res.json({
            success: 'false',
            message: 'không tồn tại sản phẩm'
        });

    }
}