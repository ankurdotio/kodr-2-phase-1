const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            _id: decoded.id
        })

        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.seller = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}


module.exports = { authSeller }