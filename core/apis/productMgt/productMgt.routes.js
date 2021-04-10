const express = require("express");
const router = express.Router();

const {createProduct, getProductById, allProducts,allUserProducts,deleteProduct,productByLocation, productByRadius} = require("./productMgt.controller");
const { protect } = require("../../common/authMiddleware/auth");


router.route("/create").post(protect,createProduct);
router.route("/all").get(allProducts)
router.route("/userProducts").get(protect,allUserProducts)
router.route("/delete").post(protect,deleteProduct)
router.route("/getProductByLocation").get(protect, productByLocation)
router.route("/getProductById").get(protect, getProductById)
module.exports = router;
