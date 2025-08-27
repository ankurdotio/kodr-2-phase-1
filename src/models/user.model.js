const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        }
    },
    role: {
        type: String,
        enum: [ "seller", "user" ],
        default: "user"
    },
    password: {
        type: String,
        select: false
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel