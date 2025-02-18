const CartModel = require("../../models/carts.model");
// const ProductModel = require("../../models/product.model");
const productModel = require("../../models/product.model");
const BuildModel = require("../../models/build.model");
const CategoriesModel = require("../../models/categories.model");
const newPrice = require("../../../../helpers/newPrice.helper");
// module.exports.index = async (req, res) => {
//     const cartId = req.cookies.cartId;
//     // console.log(car)
//     const dataCart = await CartModel.findOne({ _id: cartId });

//     if (dataCart.products.length > 0) {
//         for (const item of dataCart.products) {
//             const productId = item.product_id;
//             const productInfo = await ProductModel.findOne({
//                 _id: productId
//             }).select("title thumbnail slug price discountPercentage");

//             productInfo._doc.priceNew = newPrice.newPriceProductDetail(productInfo);

//             item._doc.productInfo = productInfo;
//             item._doc.totalPrice = productInfo._doc.priceNew * item.quantity;
//         }
//     }
//     // console.log(dataCart)
//     dataCart._doc.totalPrice = dataCart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);
//     // console.log(dataCart)

//     res.json({
//         // cartId: cartId
//         dataCart: dataCart,
//     });
// }
module.exports.getCategories = async (req, res) => {
    try {
        // Lấy tất cả danh mục cha
        const parentCategories = await CategoriesModel.find({
            parent_id: "",
            status: "active",
            deleted: false,
            slug: { $ne: "laptop" }
        }).lean();

        // Kết quả cuối cùng
        const result = [];

        for (const parent of parentCategories) {
            // Lấy danh mục con cho từng danh mục cha
            const subCategories = await CategoriesModel.find({
                parent_id: parent._id,
                status: "active",
                deleted: false,
            }).lean();

            // Lấy tất cả ID danh mục (cha + con)
            const allCategoryIds = [parent._id, ...subCategories.map((sub) => sub._id)];

            // Lấy sản phẩm cho danh mục cha và con
            const products = await productModel
                .find({
                    category: { $in: allCategoryIds },
                    deleted: false,
                })
                .sort({ position: "desc" })
                .lean();

            const newProduct = products.map(item => {
                item.priceNew = (item.price - (item.price * item.discountPercentage / 100)).toFixed(0);
                return item;
            });
            // console.log(newProduct)
            // Tổ chức dữ liệu theo cấu trúc yêu cầu
            result.push({
                parents: parent.slug,
                title: parent.title,
                childrens: subCategories.map((sub) => sub),
                // childrensTitle: subCategories.map((sub) => sub.title),

                products: products,
            });
        }

        // console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Có lỗi xảy ra");
    }
};
module.exports.setSlugParent = async (req, res) => {
    try {
        let sort = {};
        if (req.query.filter) {
            const [key, order] = req.query.filter.split('-');
            sort[key] = order;
        } else {
            sort.position = 'desc';
        }

        // console.log('req.query.filter', req.query.filter)
        const category = await CategoriesModel.findOne({ slug: req.params.slugParent, deleted: false });
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

        let find = {
            category: { $in: [category.id, ...listSubCategoryId] },
            deleted: false,
        }

        const products = await productModel.find(find)
            .sort(sort);
        const newProduct = newPrice.newPriceProducts(products);
        console.log(listSubCategory);
        res.json({
            status: "success",
            newProduct: newProduct,
            listSubCategory: listSubCategory,
        });
    } catch (error) {

        res.json({
            status: "false",
            message: "không tìm thấy sản phẩm nào.",
        });

    }
};
module.exports.build = async (req, res) => {
    const cartId = req.cookies.cartId;
    const existBuild = await BuildModel.findOne({ cart_id: cartId });
    if (existBuild) {
        const products = existBuild.products.map((product) => {
            return product.product_id
        })
        const productsBuilt = await productModel.find({ _id: [...products] })
        const newProduct = newPrice.newPriceProducts(productsBuilt);

        res.json({
            status: "success",
            productsBuilt: newProduct
        })
    } else {
        res.json({
            status: "false",
            message: 'Lỗi hệ thống không thể lấy được sản phẩm đã thêm'
        })
    }
};

module.exports.addBuild = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.body.productId;
        const quantity = req.body.quantity;

        console.log(productId, quantity);

        const object = {
            product_id: productId,
            quantity: quantity
        };

        const existBuild = await BuildModel.findOne({ cart_id: cartId });

        if (existBuild) {
            // console.log('existBuild', existBuild);
            await BuildModel.updateOne(
                { cart_id: cartId },
                { $push: { products: object } }
            );
        } else {
            // Nếu không tồn tại, tạo mới
            const newBuild = new BuildModel({
                cart_id: cartId,
                products: [object]
            });
            await newBuild.save();
            // console.log('New Build Created:', newBuild);
        }
        // Trả về phản hồi thành công
        res.json({
            status: "Thêm thành công"
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error adding build:', error);
        res.status(500).json({
            status: "Thêm thất bại",
            error: error.message
        });
    }
}
module.exports.removeBuild = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.body.productId;
        await BuildModel.updateOne({
            cart_id: cartId,
        }, {
            $pull: { products: { product_id: productId } }
        });

        res.json({
            status: "Thêm sản phẩm khỏi bảng thành công"
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error adding build:', error);
        res.status(500).json({
            status: "Thêm thất bại",
            error: error.message
        });
    }
}
module.exports.addToCart = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        // console.log(cartId);
        const build = await BuildModel.findOne({ cart_id: cartId });
        const buildProducts = build.products;
        const cart = await CartModel.findOne({ _id: cartId });
        const updatedProducts = [...cart.products];
        // console.log(updatedProducts)
        // console.log(build_id.products)
        buildProducts.forEach((buildProduct) => {
            const existingProduct = updatedProducts.find(
                (cartProduct) => cartProduct.product_id === buildProduct.product_id
            );

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, cộng dồn quantity
                existingProduct.quantity += buildProduct.quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                updatedProducts.push({
                    product_id: buildProduct.product_id,
                    quantity: buildProduct.quantity,
                });
            }
        });
        cart.products = updatedProducts;
        await cart.save();
        build.products = []
        await build.save();
        res.json({
            status: 200,
            message: "Đã thêm sản phẩm vào giỏ hàng thành công",
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        // console.error('Error adding build:', error);
        res.json({
            status: 400,
            error: error.message,
        });
    }
}
module.exports.removeAllBuild = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        console.log(cartId)

        const build = await BuildModel.findOne({ cart_id: cartId });
        if (build) {
            build.products = [];
            build.save();
            res.json({
                status: 200,
                message: "xóa thành công",
            })
        }
    } catch (error) {
        res.json({
            status: 400,
            error: "không tìm thấy bản ghi Build",
        });
    }


}