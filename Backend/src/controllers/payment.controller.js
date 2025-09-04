const Razorpay = require('razorpay');
const paymentModel = require("../models/payment.model");
const productModel = require('../models/product.model');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


async function createPayment(req, res) {

    const productId = req.params.productId

    const product = await productModel.findById(productId)

    const order = await razorpay.orders.create({
        amount: product.price.amount * 100,
        currency: product.price.currency,
    })

    const payment = await paymentModel.create({
        orderId: order.id,
        user: req.user._id,
        product: productId,
        price: {
            amount: product.price.amount,
            currency: product.price.currency
        }
    })

    res.status(201).json({
        message: "order created successfully",
        order: payment,
        user: req.user,
    })

}


async function verifyPayment(req, res) {

    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET
    const { validatePaymentVerification } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js")

    const result = validatePaymentVerification({ order_id: razorpayOrderId, payment_id: razorpayPaymentId }, signature, secret)

    if (result) {

        await paymentModel.findOneAndUpdate({
            orderId: razorpayOrderId
        }, {
            paymentId: razorpayPaymentId,
            signature,
            status: "completed"
        })

        res.status(200).json({ message: "payment verified successfully", success: true })

    }
    else {
        res.status(400).json({ message: "payment verification failed", success: false })
    }

}

module.exports = { createPayment, verifyPayment }