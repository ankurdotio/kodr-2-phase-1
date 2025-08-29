const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const storageService = require("../services/storage.service")
const productModel = require("../models/product.model")

async function createProduct(req, res) {

    const price = req.body.price ? JSON.parse(req.body.price) : null;

    const seller = req.seller
    const { title, description, stock } = req.body;

    const files = await Promise.all(req.files.map(async (file) => {
        return await storageService.uploadFile(file.buffer)
    }))

    const product = await productModel.create({
        title: title,
        description: description,
        price: {
            amount: price?.amount,
            currency: price?.currency || "INR"
        },
        images: files.map(i => i.url),
        seller: seller._id,
        stock: parseInt(stock) || 0
    })

    res.status(201).json({
        message: "product created successfully",
        product
    })

}


async function getSellerProducts(req, res) {

    const seller = req.seller;

    const products = await productModel.find({
        seller: seller._id
    })

    res.status(200).json({
        message: "seller products fetched successfully",
        products
    })


}

module.exports = {
    createProduct,
    getSellerProducts
}