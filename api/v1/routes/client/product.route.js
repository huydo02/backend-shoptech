const express = require('express');
const controller = require('../../controllers/client/product.controller');

const router = express.Router();
router.get("/", controller.product);
router.get("/:slugCategory", controller.slugCategory);
// router.get("/search", controller.search);



router.get("/detail/:slugProduct", controller.detail);

module.exports = router;