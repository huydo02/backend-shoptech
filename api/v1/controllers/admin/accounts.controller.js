const AccountModel = require('../../models/account.model');
const RoleModel = require('../../models/role.model');

const systemConfig = require('../../../../config/system');
const md5 = require('md5');

// module.exports.index = async (req, res) => {
//     const find = {
//         deleted: false,
//     };
//     const data = await AccountModel.find(find).select("-password -token");

//     for (const item of data) {
//         if (item.role_id !== "") {
//             const role = await RoleModel.findOne({
//                 _id: item.role_id,
//                 deleted: false,
//             })
//             item.role = role;
//         } else {
//             item.role = "";
//         }
//     }
//     // console.log(data)
//     res.render("admin/pages/accounts/index", {
//         titlePage: "danh sach tai khoan",
//         data: data,
//     });
// }
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    const data = await AccountModel.find(find).select("-password -token");

    for (const item of data) {
        if (item.role_id !== "") {
            const role = await RoleModel.findOne({
                _id: item.role_id,
                deleted: false,
            }).select("title");
            item._doc.role = role;
        } else {
            item._doc.role = "";
        }
    }
    // console.log(data)
    res.json({
        status: "success",
        data: data
    })
}
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
    const roles = await RoleModel.find(find);
    // console.log(roles)
    res.render("admin/pages/accounts/create", {
        titlePage: "thêm mới tai khoan",
        roles: roles,
    });
}

module.exports.createPost = async (req, res) => {
    const emailExists = await AccountModel.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        req.flash("error", `Email ${req.body.email} Da ton tai`);
        // res.redirect('back');
        return res.json({
            status: 'false',
            message: `Email ${req.body.email} Đã tồn tại`,
        })
    }

    req.body.password = md5(req.body.password);
    const record = new AccountModel(req.body);
    await record.save();

    return res.json({
        status: 'success',
        message: "Tạo tài khoản mới thành công",
    })
}

// module.exports.edit = async (req, res) => {
//     // console.log(req.params.id)
//     const find = {
//         _id: req.params.id,
//         deleted: false,
//     };
//     try {
//         const data = await AccountModel.findOne(find);

//         const role = await RoleModel.find({
//             deleted: false,
//         }).select("title role_id")

//         res.render("admin/pages/accounts/edit", {
//             titlePage: "danh sach tai khoan",
//             data: data,
//             roles: role,
//         });
//     } catch (error) {

//     }
// }
module.exports.edit = async (req, res) => {
    // console.log(req.params.id)
    const find = {
        _id: req.params.id,
        deleted: false,
    };
    try {
        const data = await AccountModel.findOne(find);

        const role = await RoleModel.find({
            deleted: false,
        }).select("title role_id password")

        res.json({
            status: "success",
            data: data,
            roles: role,
        });
    } catch (error) {

    }
}
module.exports.editPatch = async (req, res) => {
    // try {
    const emailExists = await AccountModel.findOne({
        _id: { $ne: req.params.id },
        email: req.body.email,
        deleted: false
    });
    if (emailExists) {
        // req.flash("error", `Email ${req.body.email} Da ton tai`);
        // res.redirect("back");
        return res.json({
            status: "false",
            message: `Email ${req.body.email} đã tồn tại`,
        });
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        await AccountModel.updateOne({ _id: req.params.id }, req.body);
        // req.flash('success', "cap nhat thanh cong");
        // res.redirect("back");
        return res.json({
            status: "success",
            message: `Cập nhật tài khoản thành công`,
        });
    }
    // } catch (error) {
    //     res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    // }
}
module.exports.delete = async (req, res) => {
    // console.log(req.params.id)
    const find = {
        _id: req.params.id,
        deleted: false,
    };
    try {
        const data = await AccountModel.updateOne(find, { deleted: true });

        res.json({
            status: "success",
            data: data,
            roles: role,
        });
    } catch (error) {
        res.json({
            status: "success",
            message: "Xóa tài khoản không thành công."
        });
    }
}