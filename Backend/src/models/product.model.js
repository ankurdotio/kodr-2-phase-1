const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [ String ],
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: [ "USD", "EUR", "INR" ],
            default: "INR"
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
})

const productModel = mongoose.model("product", productSchema)


module.exports = productModel