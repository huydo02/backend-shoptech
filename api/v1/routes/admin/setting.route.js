const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/setting-general.controller');

const multer = require('multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const upload = multer();

// const validation = require('../../validations/admin/auth.validation');

router.get('/general', controller.index);
router.post('/general',
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.settingGeneralPost
);









module.exports = router;