const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/auth.controller');

const userMiddleware = require('../../middlewares/client/users.middleware');
const validate = require('../../validations/client/auth.validation')

router.get('/info', userMiddleware.isLogin, controller.info);

router.get('/login', controller.login);
router.post('/login', validate.login, controller.loginPost);

router.get('/register', controller.register);
router.post('/register', validate.register, controller.registerPost);

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot', controller.postForgotPassword);

router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', controller.otpPasswordPost);

router.get('/password/reset', controller.resetPassword);
router.post('/password/reset', validate.resetPassword, controller.resetPasswordPost);









module.exports = router;