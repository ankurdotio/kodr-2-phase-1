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


async function getAllProducts(req, res) {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const search = req.query.search ? req.query.search.trim() : '';
        const sort = req.query.sort || 'newest';

        const filter = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [ { title: regex }, { description: regex } ];
        }

        let query = productModel.find(filter);

        switch (sort) {
            case 'price-asc':
                query = query.sort({ 'price.amount': 1 });
                break;
            case 'price-desc':
                query = query.sort({ 'price.amount': -1 });
                break;
            case 'stock':
                query = query.sort({ stock: -1 });
                break;
            default: // newest
                query = query.sort({ _id: -1 });
        }

        const total = await productModel.countDocuments(filter);
        const products = await query
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            message: "products fetched successfully",
            products,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('getAllProducts error', err);
        res.status(500).json({ message: 'failed to fetch products' });
    }
}


// New: get product by id
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) return res.status(404).json({ message: 'product not found' });
        res.status(200).json({ message: 'product fetched successfully', product });
    } catch (err) {
        console.error('getProductById error', err);
        res.status(500).json({ message: 'failed to fetch product' });
    }
}
module.exports = {
    createProduct,
    getSellerProducts,
    getAllProducts,
    getProductById
}