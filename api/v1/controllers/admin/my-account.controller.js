const AccountModel = require('../../models/account.model');
const RoleModel = require('../../models/role.model');

const systemConfig = require('../../../../config/system');

module.exports.index = async (req, res) => {

    res.render("admin/pages/my-account/index", {
        titlePage: "danh sach tai khoan",
    });
}