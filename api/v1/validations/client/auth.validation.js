module.exports.login = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'vui lòng email');
        res.redirect('back');
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'vui lòng mat khau');
        res.redirect('back');
        return;
    }
    // if (!req.body.title.length < 8) {
    //     req.flash('error', 'vui lòng nhập nhiều hơn 8 ký tự');
    //     res.redirect('back');
    //     return;
    // }
    next();
};


module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'vui lòng email');
        res.redirect('back');
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'vui lòng email');
        res.redirect('back');
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'vui lòng mat khau');
        res.redirect('back');
        return;
    }
    // if (!req.body.title.length < 8) {
    //     req.flash('error', 'vui lòng nhập nhiều hơn 8 ký tự');
    //     res.redirect('back');
    //     return;
    // }
    next();
};

module.exports.resetPassword = (req, res, next) => {

    if (req.body.password != req.body.confirmPassword) {
        res.json({
            status: 'false',
            message: "Mật khẩu xác nhận không chính xác"
        });
        return;
    }

    next();
};