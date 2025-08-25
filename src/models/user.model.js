const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: String,
})

const userModel = mongoose.model("user", userSchema)


module.exports = userModel