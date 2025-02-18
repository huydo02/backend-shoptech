const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for port 465, false for other ports
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log(process.env.EMAIL_USER);
    const mailOptions = {
        from: '"ShopTech47 👻" <gamethubmt1234@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: 'Hello ✔', // plain text body
        html: html, // html body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


// async..await is not allowed in global scope, must use a wrapper
