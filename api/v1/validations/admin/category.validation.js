module.exports.categoryValidator = (req, res, next) => {
    console.log("valdt", req.body);
    // if (!req.body.title) {
    //     req.flash('error', 'vui lòng nhập tên sản phẩm');
    //     return res.redirect(req.get('Referrer') || '/');

    // }
    // if (!req.body.title.length < 8) {
    //     req.flash('error', 'vui lòng nhập nhiều hơn 8 ký tự');
    //     res.redirect('back');
    //     return;
    // }
    next();
};