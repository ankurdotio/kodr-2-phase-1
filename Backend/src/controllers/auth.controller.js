const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function createUser({
    username, email, fullName: { firstName, lastName }, password, role = "user"
}) {

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (isUserAlreadyExists) {
        throw new Error("user already exists")
    }


    const hash = await bcrypt.hash(password, 10)


    const user = await userModel.create({
        username,
        email,
        fullName: {
            firstName,
            lastName
        },
        password: hash,
        role: role
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    return { user, token }

}

async function registerUser(req, res) {

    const { email, fullName: { firstName, lastName }, username, password } = req.body
    try {

        const { user, token } = await createUser({
            email,
            fullName: {
                firstName,
                lastName
            },
            username,
            password
        })

        res.cookie('token', token)
        res.status(201).json({
            message: "user registered successfully",
            user: {
                username: user.username,
                fullName: user.fullName,
                _id: user._id,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

async function loginUser(req, res) {

    const { email, username, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "invalid username or email`"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    })

}

async function registerSeller(req, res) {

    const { username, email, fullName: { firstName, lastName }, password } = req.body

    try {

        const { user: seller, token } = await createUser({
            username,
            email,
            fullName: {
                firstName,
                lastName
            },
            password,
            role: "seller"
        })

        res.cookie('token', token)
        res.status(201).json({
            message: "seller registered successfully",
            user: {
                username: seller.username,
                fullName: seller.fullName,
                _id: seller._id,
                email: seller.email,
                role: seller.role
            }
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

function getCurrentUser(req, res) {
    const u = req.user;
    if (!u) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json({
        message: 'current user fetched successfully',
        user: {
            id: u._id,
            username: u.username,
            email: u.email,
            fullName: u.fullName,
            role: u.role
        }
    });
}

function logout(req, res) {
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ message: 'logged out' });
}


module.exports = {
    registerUser,
    loginUser,
    registerSeller,
    getCurrentUser,
    logout
}

