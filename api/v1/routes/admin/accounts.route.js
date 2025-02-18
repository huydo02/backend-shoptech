const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/accounts.controller');

const multer = require('multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const upload = multer();

const validationCategory = require('../../validations/admin/category.validation');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    // upload.single('avatar'),
    // uploadCloud.upload,
    // validationCategory.categoryValidator,
    controller.createPost
);
router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    // upload.single('avatar'),
    // uploadCloud.upload,
    // validationCategory.categoryValidator,
    controller.editPatch
);


router.patch('/delete/:id',

    controller.delete
);







module.exports = router;