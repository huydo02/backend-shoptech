const UserModel = require('../../models/users.model');

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await UserModel.findOne({
            token: req.cookies.tokenUser,
            deleted: false,
            status: 'active'
        }).select('-password');

        if (user) {
            res.locals.user = user;
        };
    }
    next();
}

module.exports.isLogin = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect('/auth/login');
    } else {
        const user = await UserModel.findOne({
            token: req.cookies.tokenUser
        }).select('-password');

        if (!user) {
            res.redirect('/auth/login');
        } else {
            res.locals.user = user;
            next();
        };
    }
};