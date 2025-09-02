const express = require('express');
const authControllers = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware")


const router = express.Router();


router.post("/user/register", authControllers.registerUser)

router.post("/user/login", authControllers.loginUser)

router.post("/seller/register", authControllers.registerSeller)

router.post("/seller/login", authControllers.loginUser)

// current authenticated user
router.get("/me", authUser, authControllers.getCurrentUser)

router.post('/logout', authControllers.logout)


module.exports = router