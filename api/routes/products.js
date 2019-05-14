const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const fileUploadController = require('../controllers/fileStorage');
const ProductsController = require('../controllers/products');

router.get("/",  checkAuth, ProductsController.products_get_all);

router.post("/", checkAuth, fileUploadController.single("productImage"), ProductsController.products_post_product);

router.get("/:productId", ProductsController.products_get_product );

router.patch("/:productId", checkAuth, ProductsController.products_udpate_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;
