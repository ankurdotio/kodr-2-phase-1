const express = require('express');
const authControllers = require("../controllers/auth.controller")


const router = express.Router();


router.post("/user/register", authControllers.registerUser)

router.post("/user/login", authControllers.loginUser)

router.post("/seller/register", authControllers.registerSeller)

router.post("/seller/login", authControllers.loginUser)


module.exports = router