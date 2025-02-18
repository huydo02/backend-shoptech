const createTreeHelper = require('../../../../helpers/createTree.helper');
const paginationsHelper = require('../../../../helpers/paginations.helper');
const systemConfig = require('../../../../config/system');
// const fs = require('fs');
const Categories = require('../../models/categories.model');
//[Get]/admin/list-product
// module.exports.index = async (req, res) => {
//     let find = {
//         deleted: false,
//     };

//     const categories = await Categories.find(find)

//     const categoriesNew = createTreeHelper.tree(categories);

//     const countCategory = await Categories.countDocuments();
//     let objectPaginations = paginationsHelper(
//         {
//             currentPage: 1,
//             limit: 20
//         },
//         req.query,
//         countCategory
//     )
//     // console.log(objectPaginations)
//     res.render("admin/pages/category/listCategory", {
//         titlePage: "Danh muc san pham",
//         categories: categoriesNew,
//         paginations: objectPaginations,

//     });
// }

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const categories = await Categories.find(find)

    const categoriesNew = createTreeHelper.tree(categories);

    res.json({
        status: 'success',
        categories: categoriesNew,
    })
}
module.exports.create = async (req, res) => {

    let find = {
        deleted: false,
    }
    const categories = await Categories.find(find);

    const categoriesNew = createTreeHelper.tree(categories);

    // console.log(categoriesNew)
    res.render("admin/pages/category/create", {
        titlePage: "Thêm Danh muc san pham",
        categories: categoriesNew,
    });
}
// module.exports.createPost = async (req, res) => {
//     // console.log(req.body);
//     // if (res.locals.role.permissions.includes('products-category-create')) {
//         if (req.body.position == "") {
//             const countPositon = await Categories.countDocuments();
//             req.body.position = countPositon + 1;
//         } else {
//             req.body.position = parseInt(req.body.position);
//         }

//         try {
//             const category = new Categories(req.body);
//             await category.save();
//         } catch (error) {
//             console.log(error);
//         }
//         res.redirect(`${systemConfig.prefixAdmin}/list-category`);
//     // } else {
//     //     return;
//     // }
// }
module.exports.createPost = async (req, res) => {

    if (req.body.position == "") {
        const countPositon = await Categories.countDocuments();
        req.body.position = countPositon + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    try {
        const category = new Categories(req.body);
        await category.save();
    } catch (error) {
        console.log(error);
    }
    res.json({
        status: 'success',
        message: 'Thêm danh mục mới thành công'
    })

}
//[PATCH]/admin/list-category/edit/:id
// module.exports.edit = async (req, res) => {
//     try {
//         let find = {
//             deleted: false,
//         };
//         const id = req.params.id;
//         // get all value of table categories
//         const categories = await Categories.find(find);
//         // create tree
//         const categoriesNew = createTreeHelper.tree(categories);
//         // find by id
//         const value = await Categories.findOne({ _id: id });
//         console.log("value", value);

//         res.render("admin/pages/category/edit", {
//             titlePage: "chỉnh sửa Danh muc san pham",
//             categories: categoriesNew,
//             value: value,
//         });
//         res.json({
//             status: "success",
//             categories: categoriesNew,
//             value: value,
//         })
//     } catch (error) {
//         res.redirect(`${systemConfig.prefixAdmin}/list-category`);
//     }

// }
module.exports.edit = async (req, res) => {
    try {
        let find = {
            deleted: false,
        };
        const id = req.params.id;
        // get all value of table categories
        const categories = await Categories.find(find);
        // create tree
        const categoriesNew = createTreeHelper.tree(categories);
        // find by id
        const value = await Categories.findOne({ _id: id });
        console.log("value", value);

        res.json({
            status: "success",
            categories: categoriesNew,
            value: value,
        })
    } catch (error) {

        res.json({
            status: "false",
            message: error,
        })
    }

}
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position);
        await Categories.updateOne({ _id: id }, req.body);
        res.json({ status: "success", message: "Sửa danh mục sản phẩm thành công" });

    } catch (error) {
        res.json({ status: "false", message: error.message });
    }

}
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Categories.updateOne({ _id: id }, { deleted: true });
        res.json({ status: "success", message: "xóa danh mục sản phẩm thành công" });

    } catch (error) {
        res.json({ status: "false", message: error.message });
    }

}


