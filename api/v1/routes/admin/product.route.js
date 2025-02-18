const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product.controller');
const multer = require('multer');
const validation = require('../../validations/admin/product.validation');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const upload = multer();

router.get('/', controller.product);
router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi-status', controller.changeMultiStatus);
router.delete('/delete-product/:id', controller.deleteProduct);
// get ADD product page
router.get('/create', controller.create);
// post form add product page
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validation.createValidator,
    controller.createPost
);
// get EDIT product page
router.get('/edit/:id', controller.edit);
// PATCH EDIT product page
router.patch('/edit/:id',
    // validation.createValidator,
    upload.single('thumbnail'),
    uploadCloud.upload,
    validation.createValidator,
    controller.editPatch
);
// GET DETAIL product page
router.get('/detail/:id', controller.detail);



module.exports = router;