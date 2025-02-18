const systemConfig = require('../../../../config/system');

const AccountModel = require('../../models/account.model');
const RolesModel = require('../../models/role.model');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);

    } else {
        const user = await AccountModel.findOne({ token: req.cookies.token }).select("-password");
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            // console.log(user);
            const role = await RolesModel.findOne({
                _id: user.role_id,
            }).select("title permissions");

            res.locals.user = user;
            res.locals.role = role;
            // console.log("reslocals", res.locals);
            next();
        }
    }
    // next();
}