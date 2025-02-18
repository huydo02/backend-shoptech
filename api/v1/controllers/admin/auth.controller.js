const AccountModel = require('../../models/account.model');
const Roles = require('../../models/role.model');


const systemConfig = require('../../../../config/system');
const md5 = require('md5');


module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            titlePage: "dang nhap",
        });
    }

}

module.exports.info = async (req, res) => {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.json({
            status: 'false',
            message: "Chưa đăng nhập"
        });

    }
    const info = await AccountModel.findOne({ token: token, deleted: false }).select("-password");
    const roles = await Roles.findOne({ _id: info.role_id }).select("permissions");
    res.json({
        status: 'success',
        info: info,
        roles: roles,
        message: 'Đăng nhập thành công.'
    })
}
module.exports.loginPost = async (req, res) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;

    const user = await AccountModel.findOne({ email: email, deleted: false });
    // console.log(user);
    if (!user) {
        return res.json({
            status: 'false',
            message: "Email không tồn tại."
        });

    }

    if (md5(password) != user.password) {

        return res.json({
            status: 'false',
            message: "Mật khẩu không chính xác."
        });
    }

    if (user.status == "inactive") {

        return res.json({
            status: 'false',
            message: "Tài khoản đang bị khóa."
        });
    }
    // console.log('cookiews', user.token)
    // const info = user.deleteOne('password');
    // res.cookie("token", user.token);
    // res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    const info = await AccountModel.findOne({ email: email, deleted: false }).select("-password");

    res.cookie("token", user.token).json({
        status: 'success',
        info: info,
        message: 'Đăng nhập thành công.'
    })
}
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)

};