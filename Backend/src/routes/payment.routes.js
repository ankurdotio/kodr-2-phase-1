const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const paymentController = require("../controllers/payment.controller")

const router = express.Router()


/* POST /api/payments/create/productId */
router.post("/create/:productId", authMiddleware.authUser, paymentController.createPayment)


/* POST /api/payments/verify */
router.post("/verify", authMiddleware.authUser, paymentController.verifyPayment)

module.exports = router