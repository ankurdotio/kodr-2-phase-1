const express = require('express');
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes")
const cors = require("cors")
const paymentRoutes = require("./routes/payment.routes")


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/payments", paymentRoutes)

module.exports = app