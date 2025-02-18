const productModel = require('../../models/product.model');
const Categories = require('../../models/categories.model');
const AccountModel = require('../../models/account.model');

const createTreeHelper = require('../../../../helpers/createTree.helper');

const fillterHelper = require('../../../../helpers/fillter.helper');
const searchHelper = require('../../../../helpers/search.helper');
const paginationsHelper = require('../../../../helpers/paginations.helper');
const systemConfig = require('../../../../config/system');
//[Get]/admin/list-product
// module.exports.product = async (req, res) => {

//     let find = {
//         deleted: false,
//     };
//     //create fillter
//     const fillters = fillterHelper(req.query);
//     const search = searchHelper(req.query);
//     // console.log(search);
//     if (search.regex) {
//         // console.log('co ton tai');
//         find.title = search.regex;
//     };

//     if (req.query.status) {
//         find.status = req.query.status;
//         console.log(req.query.status)
//     }
//     const countProducts = await productModel.countDocuments(find);

//     let objectPaginations = paginationsHelper(
//         {
//             currentPage: 1,
//             limit: 4
//         },
//         req.query,
//         countProducts
//     )

//     let sort = {};
//     if (req.query.sortKey && req.query.sortValue) {
//         // console.log(req.query);
//         sort[req.query.sortKey] = req.query.sortValue
//     } else {
//         sort.position = 'desc';
//     }
//     // console.log(objectPaginations);
//     const products = await productModel.find(find)
//         .limit(objectPaginations.limit)
//         .skip(objectPaginations.skip)
//         .sort(sort);
//     for (const product of products) {
//         //lấy thông tin người tạo
//         const user = await AccountModel.findOne({
//             _id: product.createdBy.account_id,
//         })
//         if (user) {
//             product.accountFullName = user.fullname;
//         }
//         //lấy thông tin người cập nhật gần nhất

//         const updatedBy = product.updatedBy.slice(-1)[0];
//         // console.log("thông tin người update", updatedBy)
//         if (updatedBy) {
//             const userUpdated = await AccountModel.findOne({
//                 _id: updatedBy.account_id,
//             });

//             updatedBy.accountFullName = userUpdated.fullname;
//         }

//     }
//     res.render("admin/pages/product/listproduct", {
//         titlePage: "Danh sach san pham",
//         products: products,
//         fillters: fillters,
//         keywords: search.keywords,
//         paginations: objectPaginations,
//     });
//     // res.json({
//     //     products: products,
//     //     fillters: fillters,
//     //     keywords: search.keywords,
//     //     paginations: objectPaginations,
//     // })
// }
module.exports.product = async (req, res) => {
    try {
        const sort = {};
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = parseInt(req.query.pagination.pageSize); // Số lượng sản phẩm mỗi trang
        // Thứ tự sắp xếp (mặc định là tăng dần)
        const filters = req.query.filters ? req.query.filters : {};
        if (filters.status === '') {
            delete filters.status;  // Xóa trường `status` nếu giá trị là chuỗi rỗng
        }
        if (req.query.sortField && req.query.sortOrder) {
            const sortOrder = req.query.sortOrder === 'ascend' ? 1 : (req.query.sortOrder === 'descend' ? -1 : 1);
            sort[req.query.sortField] = sortOrder;
        } else {
            sort.createdAt = -1;
        }
        const current = parseInt(req.query.pagination.current);

        const query = { deleted: false, ...filters };

        const total = await productModel.countDocuments(query);

        const products = await productModel
            .find(query)
            .sort(sort)
            .skip((current - 1) * pageSize)
            .limit(pageSize);

        // console.log(products)
        res.json({
            status: 'success',
            products: products,
            total: total,
            currentPage: page,
            pageSize: pageSize,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
//[Get]/admin/list-product/change-status/:status/:id
// module.exports.changeStatus = async (req, res) => {
//     const status = req.params.status;
//     const id = req.params.id;
//     const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date(),
//     }
//     // console.log(req.params);
//     await productModel.updateOne({ _id: id }, {
//         status: status,
//         $push: { updatedBy: updatedBy }

//     });
//     req.flash("success", "Cap nhat thanh cong");
//     res.redirect('back');
// }

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    // console.log(status);
    await productModel.updateOne({ _id: id }, {
        status: status,

    });
    res.json({
        status: 'success',
        message: "Đã cập nhật trạng thái sản phẩm"
    })
}
module.exports.changeMultiStatus = async (req, res) => {
    const type = req.body.type;
    const idsProduct = req.body.idsProduct.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    }
    // console.log(idsProduct);
    switch (type) {
        case "active":
            await productModel.updateMany({ _id: idsProduct }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            })
            // res.json({
            //     status:200,
            //     messages:"success",
            // });
            break;

        case "inactive":
            await productModel.updateMany({ _id: idsProduct }, {
                status: "inactive",
                $push: { updatedBy: updatedBy }
            })
            break;
        case "delete-all":
            await productModel.updateMany({
                _id: idsProduct
            }, {
                deleted: true,
                // deletedAt: new Date()
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }
            })
            break;
        case "change-position":
            // console.log(idsProduct);
            for (const item of idsProduct) {
                let [position, id] = item.split("-");
                position = parseInt(position);
                // console.log(id, position);
                await productModel.updateOne({ _id: id }, {
                    position: position,
                    $push: { updatedBy: updatedBy }
                })
            }
            break;
        default:
            break;
    }
    res.redirect('back');
}
module.exports.deleteProduct = async (req, res) => {
    // console.log(req.params.id);
    const id = req.params.id;
    await productModel.updateOne(
        { _id: id },
        {
            deleted: true,
            // deletedAt: new Date() 
            // deletedBy: {
            //     account_id: res.locals.user.id,
            //     deletedAt: new Date(),
            // }
        })
    res.json({
        status: 'success',
        message: "Xóa sản phẩm thành công",
    })
}
module.exports.create = async (req, res) => {
    // console.log(req.params.id);
    const find = {
        deleted: false,
    }
    const categories = await Categories.find(find);
    // create tree
    const categoriesNew = createTreeHelper.tree(categories);
    // res.render("admin/pages/product/create", {
    //     titlePage: "Them san pham",
    //     categories: categoriesNew,
    // });
    res.json({
        status: 'success',
        categories: categoriesNew
    })
}
module.exports.createPost = async (req, res) => {
    // console.log(req.body);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = req.body.stock;

    if (req.body.position == "") {
        const countPositon = await productModel.countDocuments();
        req.body.position = countPositon + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // req.body.createdBy = {
    //     account_id: res.locals.user.id,
    // };

    try {
        const product = new productModel(req.body);
        await product.save();
    } catch (error) {
        console.log(error);
    }
    res.json({
        status: "success",
        message: "Thêm sản phẩm mới thành công"
    })
}
// get edit product page
// module.exports.edit = async (req, res) => {
//     try {
//         const find = {
//             deleted: false,
//             _id: req.params.id,
//         }
//         const product = await productModel.findOne(find);
//         // console.log(product);
//         const findCategory = {
//             deleted: false,
//         }
//         const categories = await Categories.find(findCategory);
//         // create tree
//         const categoriesNew = createTreeHelper.tree(categories);

//         // res.render("admin/pages/product/edit", {
//         //     titlePage: "sua san pham",
//         //     product: product,
//         //     categories: categoriesNew,
//         // });
//         res.json({
//             status: 'success',
//             product: product,
//             categories: categoriesNew
//         })
//     } catch (error) {
//         // res.redirect(`${systemConfig.prefixAdmin}/list-product`);
//         res.json({
//             status: 'success',
//             message: 'không tìm thấy sản phẩm'
//         })

//     }

// }
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }
        const product = await productModel.findOne(find);
        // console.log(product);
        const findCategory = {
            deleted: false,
        }
        const categories = await Categories.find(findCategory);
        // create tree
        const categoriesNew = createTreeHelper.tree(categories);

        res.json({
            status: 'success',
            product: product,
            categories: categoriesNew
        })
    } catch (error) {
        // res.redirect(`${systemConfig.prefixAdmin}/list-product`);
        res.json({
            status: 'success',
            message: 'không tìm thấy sản phẩm'
        })

    }

}
// module.exports.editPatch = async (req, res) => {

//     req.body.price = parseInt(req.body.price);
//     req.body.discountPercentage = parseInt(req.body.discountPercentage);
//     req.body.stock = req.body.stock;

//     // if (req.file) {
//     //     req.body.thumbnail = `/uploads/${req.file.filename}`;
//     // }
//     // const oldProduct = await productModel.findOne({ _id: req.params.id });
//     // console.log('./public' + oldProduct.thumbnail)
//     try {
//         // const updatedBy = {
//         //     account_id: res.locals.user.id,
//         //     updatedAt: new Date(),
//         // }
//         // req.body.updatedBy = updatedBy;
//         await productModel.updateOne({
//             _id: req.params.id
//         }, {
//             ...req.body,
//             // $push: { updatedBy: updatedBy }
//         });
//         // const oldFilePath = ('./public' + oldProduct.thumbnail);
//         // fs.unlink(oldFilePath, function (err) {
//         //     if (err && err.code == 'ENOENT') {
//         //         // file doens't exist
//         //         console.info("không tồn tại file, không thể xóa");
//         //     } else if (err) {
//         //         // other errors, e.g. maybe we don't have enough permission
//         //         console.error("Error occurred while trying to remove file");
//         //     } else {
//         //         console.info(`đã xóa`);
//         //     }
//         // });
//         req.flash("success", "Cap nhat thanh cong");
//         res.redirect(`${systemConfig.prefixAdmin}/list-product`);
//     } catch (error) {
//         console.log(error);
//         req.flash("error", "Cap nhat thất bại");
//         res.redirect("back");
//     }
// }
module.exports.editPatch = async (req, res) => {
    if (!req.file) {
        req.body.thumbnail = req.body.thumbnail[0]
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = req.body.stock;
        // console.log("nếu không có file", req.body.thumbnail);
        try {

            await productModel.updateOne({
                _id: req.params.id
            }, {
                ...req.body,
            });

            res.json({
                status: 'success',
                message: 'Cập nhật sản phẩm thành công'
            })
        } catch (error) {
            res.json({
                status: 'false',
                message: error
            })
        }
    } else {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = req.body.stock;
        // console.log(req.body);
        // console.log(" có file", req.body);

        try {

            await productModel.updateOne({
                _id: req.params.id
            }, {
                ...req.body,
            });

            res.json({
                status: 'success',
                message: 'Cập nhật sản phẩm thành công'
            })
        } catch (error) {
            res.json({
                status: 'false',
                message: error
            })
        }
    }

}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }
        const product = await productModel.findOne(find);
        // console.log(product);
        res.render("admin/pages/product/detail", {
            titlePage: "chi tiet san pham",
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/list-product`);

    }
    // res.render("admin/pages/product/detail")

}