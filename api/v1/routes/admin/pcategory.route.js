const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../../controllers/admin/category.controller');
const validationCategory = require('../../validations/admin/category.validation');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const upload = multer();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    // upload.single('thumbnail'),
    // uploadCloud.upload,
    // validationCategory.categoryValidator,
    controller.createPost,
);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validationCategory.categoryValidator,
    controller.editPatch
);

router.patch('/delete/:id', controller.delete);





module.exports = router;