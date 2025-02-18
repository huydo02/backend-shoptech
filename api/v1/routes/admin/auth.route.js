const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/auth.controller');

// const multer = require('multer');
// const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
// const upload = multer();

const validation = require('../../validations/admin/auth.validation');

router.get('/login', controller.login);
router.get('/info', controller.info);

router.post('/login',
    // validation.authValidator,
    controller.loginPost

);
router.get('/logout', controller.logout);










module.exports = router;