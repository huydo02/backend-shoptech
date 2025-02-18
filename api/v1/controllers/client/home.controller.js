
const CategoriesModel = require("../../models/categories.model");
const createTreeHelper = require('../../../../helpers/createTree.helper');
const productModel = require("../../models/product.model");
const newPriceProducts = require("../../../../helpers/newPrice.helper");
const CartsModel = require("../../models/carts.model");

// module.exports.index = async (req, res) => {

//     const laptopCategory = await CategoriesModel.findOne({
//         title: "Laptop",
//         deleted: false,
//         status: "active",
//     });

//     // Lấy tất cả danh mục con của Laptop (bao gồm Laptop và MSI)
//     const categories = await CategoriesModel.find({
//         $or: [
//             { _id: laptopCategory._id }, // Laptop
//             { parent_id: laptopCategory._id }, // Các danh mục con
//         ],
//         deleted: false,
//         status: "active",
//     });
//     const categoryIds = categories.map((category) => category._id);
//     const products = await productModel.find({
//         category: { $in: categoryIds },
//         deleted: false,
//         status: "active",
//     });
//     const laptop = newPrice.newPriceProducts(products);

//     // console.log(laptop);
//     const KeyboardCategory = await CategoriesModel.findOne({
//         slug: "ban-phim",
//         deleted: false,
//         status: "active",
//     });

//     // Lấy tất cả danh mục con của Laptop (bao gồm Laptop và MSI)
//     const categorieskeyboard = await CategoriesModel.find({
//         $or: [
//             { _id: KeyboardCategory._id }, // Laptop
//             { parent_id: KeyboardCategory._id }, // Các danh mục con
//         ],
//         deleted: false,
//         status: "active",
//     });
//     const categorykbIds = categorieskeyboard.map((category) => category._id);
//     const prds = await productModel.find({
//         category: { $in: categorykbIds },
//         deleted: false,
//         status: "active",
//     });
//     const keyboard = newPrice.newPriceProducts(prds);
//     console.log(keyboard)
//     res.json({
//         status: 200,
//         products: laptop,
//         keyboards: keyboard
//         // keyboard:
//     });
// };

module.exports.index = async (req, res) => {
    try {
        // Lấy tất cả danh mục cha
        const parentCategories = await CategoriesModel.find({
            parent_id: "",
            status: "active",
            deleted: false,
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
                    status: 'active',
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


module.exports.menu = async (req, res) => {
    let find = {
        deleted: false,
    };

    const categories = await CategoriesModel.find(find)
    const categoriesNew = createTreeHelper.tree(categories);

    // res.locals.tree = categoriesNew;
    res.json(categoriesNew);
    // next();
}

