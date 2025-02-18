const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/order.controller');

//route get all orders 
router.get('/', controller.index);

router.get('/detail/:id', controller.detailOrder);

router.patch('/edit-order/:id', controller.patchStatus);











module.exports = router;