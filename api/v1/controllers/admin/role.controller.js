const Roles = require('../../models/role.model');
const systemConfig = require('../../../../config/system');

// module.exports.index = async (req, res) => {
//     const find = {
//         deleted: false,
//     };
//     const roles = await Roles.find(find);
//     res.render("admin/pages/role/index", {
//         titlePage: "Phân quyền",
//         roles: roles,
//     });
// }

module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    const roles = await Roles.find(find);
    res.json({
        status: 'success',
        dataRoles: roles
    })
}
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        titlePage: "thêm mới Phân quyền",
    });
}

module.exports.createPost = async (req, res) => {
    try {
        console.log(req.body)
        const record = new Roles(req.body);

        await record.save();
        res.json({
            status: "success",
            message: "Thêm quyền thành công",
        })
    } catch (error) {
        res.json({
            status: "false",
            message: error,
        })
    }



}

// module.exports.edit = async (req, res) => {
//     try {
//         const id = req.params.id;

//         let find = {
//             _id: id,
//             deleted: false,
//         }
//         const data = await Roles.findOne(find);
//         console.log(data);
//         res.render("admin/pages/role/edit", {
//             titlePage: "thêm mới Phân quyền",
//             data: data,
//         });
//     } catch (error) {
//         res.redirect(`${systemConfig.prefixAdmin}/roles`)
//     }
// }
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false,
        }
        const data = await Roles.findOne(find);
        console.log(data);
        res.json({
            status: 'success',
            data: data
        })
    } catch (error) {
        res.json({
            status: 'false',
            message: 'Lỗi không tìm thấy id quyền'
        })
    }
}
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Roles.updateOne({ _id: id }, req.body);
        res.json({
            status: 'success',
            message: "Cập nhật quyền thành công"
        })
    } catch (error) {
        res.json({
            status: 'false',
            message: "Cập nhật quyền không thành công"
        })
    }
}
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Roles.updateOne({ _id: id }, { deleted: true });
        res.json({
            status: 'success',
            message: "Xóa quyền thành công"
        })
    } catch (error) {
        res.json({
            status: 'false',
            message: "Xóa quyền không thành công"
        })
    }
}
module.exports.permissions = async (req, res) => {

    let find = {
        deleted: false,
    }

    const permissions = await Roles.find(find);
    // console.log(permissions)
    res.render("admin/pages/role/permissions", {
        titlePage: "Trang Phân quyền",
        permissions: permissions,
    });
}
module.exports.getpermissions = async (req, res) => {

    let find = {
        deleted: false,
    }

    const permissions = await Roles.find(find);
    // console.log(permissions)
    res.json({
        status: 'success',
        dataPermisstions: permissions
    })
}
// module.exports.permissionsPatch = async (req, res) => {


//     console.log(req.body)
//     const permissions = JSON.parse(req.body.permissions)
//     // console.log("permissions", permissions)
//     for (const item of permissions) {
//         // console.log("item", item.id)
//         await Roles.updateOne({ _id: item.id }, { permissions: item.permissions });
//     }
//     req.flash("success", "cap nhat quyen thanh cong");
//     res.redirect('back');
// }
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = req.body;
        for (const item of permissions) {

            await Roles.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        res.json({
            status: 'success',
            message: 'Chỉnh sửa quyền thành công'
        })
    } catch (error) {
        res.json({
            status: 'false',
            message: 'Lỗi hệ thống. Vui lòng load lại trang!'
        })
    }

}
