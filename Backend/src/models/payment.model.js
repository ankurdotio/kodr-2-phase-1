const mongoose = require("mongoose")


const paymentSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: [ "USD", "EUR", "INR" ],
            required: true
        }
    },
    status: {
        type: String,
        enum: [ "pending", "completed", "failed" ],
        default: "pending"
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String
    }
})

const paymentModel = mongoose.model("payment", paymentSchema)

module.exports = paymentModel