const UsersModel = require('../../models/users.model');
const CartModel = require('../../models/carts.model');

const ForgotPassword = require('../../models/fogot-password.model');

const systemConfig = require('../../../../config/system');
const helper = require('../../../../helpers/genarate.helper');
const sendMailhelper = require('../../../../helpers/sendMail.helper');
const generate = require('../../../../helpers/genarate.helper');

const md5 = require('md5');


module.exports.login = async (req, res) => {
    if (req.cookies.tokenUser) {
        res.redirect("/");
    } else {
        res.render("client/auth/login", {
            titlePage: "dang nhap",
        });
    }

}

module.exports.loginPost = async (req, res) => {
    // console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    // console.log(req.body, password)
    const user = await UsersModel.findOne({
        email: email,
        deleted: false
    });
    // console.log("usersdfsdfsdf", user);
    if (!user) {
        return res.json({ status: "error", message: "Email Không tồn tại" });
    }

    if (md5(password) != user.password) {
        return res.json({ status: "error", message: "Mật khẩu không chính xác" })

    }

    if (user.status == "inactive") {
        return res.json({ status: "error", message: "Tài khoản đang bị khóa" })

    }
    const existsCart = await CartModel.findOne({
        user_id: user.id
    });
    if (existsCart) {
        res.cookie("cartId", existsCart.id);
    } else {
        await CartModel.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })
    }
    const userInfo = await UsersModel.findOne({
        _id: user.id
    }).select("-password");
    // res.cookie("tokenUser", user.token);
    res.cookie("tokenUser", user.token).json({
        userInfo: userInfo,
        status: "success",
        message: "Đăng nhập thành công"
    })

}

module.exports.register = async (req, res) => {
    if (req.cookies.tokenUser) {
        res.redirect("/");
    } else {
        res.render("client/auth/register", {
            titlePage: "đăng ký",
        });
    }
}
module.exports.registerPost = async (req, res) => {
    console.log(req.body)
    const emailExists = await UsersModel.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExists) {
        return res.json({ status: "error", message: `Email ${req.body.email} đã tồn tại` });
    }

    const password = md5(req.body.password);

    const record = new UsersModel(
        {
            fullName: req.body.fullName,
            email: req.body.email,
            password: password,
            token: generate.generateRandomString(30),
        }
    );
    await record.save();

    const userInfo = await UsersModel.findOne({
        _id: record.id
    }).select("-password");

    res.cookie("tokenUser", record.token).json({
        userInfo: userInfo,
        status: "success",
        message: "Đăng ký thành công"
    })
}
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    const userInfo = [];
    res.json({
        userInfo: userInfo,
        status: "success",
        message: "Đăng xuất thành công"
    })

};

module.exports.forgotPassword = async (req, res) => {

    res.render("client/auth/forgot-password", {
        title: "quên mật khẩu",
    });
}

module.exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await UsersModel.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            status: "false",
            message: `Không tồn tại Email ${email}`
        })
        return;
    }
    const otp = helper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    // console.log(objectForgotPassword)
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    const subject = "Mã OTP lấy lại mật khẩu";
    const html = `
    Mã otp xác nhận là: <b>${otp}</b>. thời hạn sử dụng là 3 phút
    `;
    sendMailhelper.sendMail(email, subject, html);

    // res.redirect(`/auth/password/otp?email=${email}`);
    res.json({
        status: 'success',
        message: `Mã OTP đã được gửi vào Email ${email} của bạn`
    })
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    // console.log(email);

    res.render("client/auth/otp-password", {
        title: "quên mật khẩu",
        email: email
    });
};
module.exports.otpPasswordPost = async (req, res) => {

    // console.log(req.body);
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        res.json({
            status: "false",
            message: "Mã OTP không đúng"
        })
        return;
    }
    // res.send("oked ");

    const user = await UsersModel.findOne({
        email: email,
    });

    return res.cookie("tokenUser", user.token).json({
        status: "success",
        message: "Thành công"
    });

    // return res.redirect("/auth/password/reset");
};

module.exports.resetPassword = async (req, res) => {

    // console.log(req.body);

    res.render("client/auth/reset-password", {
        title: "quên mật khẩu",
        // email: email
    });
};

module.exports.resetPasswordPost = async (req, res) => {

    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    console.log(password);

    await UsersModel.updateOne({ token: tokenUser }, { password: md5(password) });

    res.json({
        status: "success",
        message: "Đã đổi mật khẩu thành công"
    });
};

module.exports.info = async (req, res) => {
    if (req.cookies.tokenUser) {
        const tokenUser = req.cookies.tokenUser;

        const infoUser = await UsersModel.findOne({
            token: tokenUser
        }).select('-password');

        // console.log(infoUser);


        return res.json({
            status: "success",
            userInfo: infoUser
        })
    } else {
        return res.json({
            status: "error",
            userInfo: []
        })
    }

};