const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")


const router = express.Router()


/* POST /api/auth/register */
router.post("/register", async (req, res) => {

    const { username, fullName: { firstName, lastName }, email, password } = req.body

    const isUserExists = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (isUserExists) {
        return res.status(422).json({
            message: "User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password,
        fullName: {
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.status(201).json({
        message: "User registered successfully",
        token: token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        }
    })

})


router.post("/random", async (req, res) => {

    const { token } = req.body

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        return res.status(200).json({
            message: "Success",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        })

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

})


/* router.post('/forgot-password')
router.post('/reset-password') */

module.exports = router