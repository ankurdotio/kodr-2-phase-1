const express = require('express');
const multer = require('multer');
const productController = require("../controllers/product.controller")
const authMiddleware = require("../middlewares/auth.middleware")


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


/* POST /api/products/ */
router.post('/',
    authMiddleware.authSeller,
    upload.array("images", 5),
    productController.createProduct
)


router.get("/seller",
    authMiddleware.authSeller,
    productController.getSellerProducts

)

module.exports = router;