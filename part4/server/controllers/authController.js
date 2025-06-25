const Owner = require('../models/Owner');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


//login
const login = async (req, res) => {
    const { phoneNumber, password, role } = req.body
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: "נא למלא את כל השדות" })
    }
    const Model = role === 'Supplier' ? Supplier : Owner;
    const foundUser = await Model.findOne({ phoneNumber });

    //not exist
    if (!foundUser)
        return res.status(401).json({ message: "אחד מהפרטים שגוי, נסה שנית" })
    //validate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match)
        return res.status(401).json({ message: "סיסמא שגויה!" })
    //all the datails without password

    const accessToken = jwt.sign({ id: foundUser._id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userName: foundUser.userName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000
    })
    res.json({ accessToken: accessToken })
}

//login
const loginEveryone = async (req, res) => {
    const { phoneNumber, password } = req.body
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: "נא למלא את כל השדות" })
    }

    let foundUser = await Supplier.findOne({ phoneNumber });

    //not exist
    if (!foundUser) {
        foundUser = await Owner.findOne({ phoneNumber });
        if (!foundUser)
            return res.status(401).json({ message: "אחד מהפרטים שגוי, נסה שנית" })
    }
    //validate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match)
        return res.status(401).json({ message: "סיסמא שגויה!" })
    //all the datails without password
    let role = foundUser instanceof Supplier ? 'Supplier' : 'Owner';


    const accessToken = jwt.sign({ id: foundUser._id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ phoneNumber: foundUser.phoneNumber }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000
    })
    res.json({ accessToken: accessToken, role })
}
const refresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized!!" })
    }
    const refreshToken = cookies.jwt
    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decode) => {
            if (err) {
                return res.status(403).json({ message: `Forbiden! ${err}, token:${refreshToken}` })
            }
            const foundUser = await User.findOne({ userName: decode.userName })
            const userInfo = { _id: foundUser._id, name: foundUser.name, roles: foundUser.roles, email: foundUser.email }
            const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            res.json({ accessToken: accessToken })
        })
}
//regist
const registerOwner = async (req, res) => {
    try {
        const { password, phoneNumber } = req.body;
        //required fields
        if (!phoneNumber || !password)
            return res.status(400).json({ message: "נא למלא את כל השדות" })
        //uniqe field
        const duplicate = await Owner.findOne({ phoneNumber }).lean()
        if (duplicate)
            return res.status(409).json({ message: "המספר קיים במערכת" })
        //bcrypt-password
        const hashPass = await bcrypt.hash(password, 10)
        const updateOwner = { password: hashPass, phoneNumber }
        const owner = await Owner.create(updateOwner)

        if (owner) {
            return res.status(201).json({ message: "The owner " + owner.phoneNumber + " created" })
        }
        else {
            //?צריך גם פה להחזיר טוקן
            return res.status(400).json({ message: "Sorry, there is a mistake...." })
        }
    } catch (err) {
        console.log(err)
    }
}

const registerSupplier = async (req, res) => {
    try {
        const { companyName, phoneNumber, representativeName, password, products } = req.body;
        //required fields
        if (!companyName || !phoneNumber || !representativeName || !password) {
            return res.status(400).json({ error: true, message: "Missing required fields" });
        }
        //uniqe field
        const duplicate = await Supplier.findOne({ phoneNumber }).lean()
        if (duplicate)
            return res.status(409).json({ message: "המספר קיים במערכת" })
        //bcrypt-password
        const hashPass = await bcrypt.hash(password, 10)
        const updateSupplier = { password: hashPass, phoneNumber, companyName, representativeName }
        const supplier = await Supplier.create(updateSupplier)
        //insert products:
        if (products && Array.isArray(products)) {
            const productDocs = products.map(product => ({
                productName: product.name,
                pricePerUnit: product.pricePerUnit,
                minimumOrderQty: product.minQuantity,
                supplierId: supplier._id
            }));

            await Product.insertMany(productDocs);
        }

        if (supplier) {
            return res.status(201).json({ message: "The supplier " + supplier.companyName + " created" })
        }
        else {
            return res.status(400).json({ message: "Sorry, there is a mistake...." })
        }
    } catch (err) {
        console.log(err)
    }
}

const registerSupplierWithProducts = async (req, res) => {
    try {
        const { companyName, phoneNumber, representativeName, password, products } = req.body;

        //required fields
        if (!companyName || !phoneNumber || !representativeName || !password) {
            return res.status(400).json({ error: true, message: "Missing required fields" });
        }

        //uniqe field
        const duplicate = await Supplier.findOne({ phoneNumber }).lean()
        if (duplicate)
            return res.status(409).json({ message: "המספר קיים במערכת" })

        //bcrypt-password
        const hashPass = await bcrypt.hash(password, 10)
        const updateSupplier = { password: hashPass, phoneNumber, companyName, representativeName }
        const supplier = await Supplier.create(updateSupplier)

        

        // 2. יצירת מוצרים אם יש
        if (Array.isArray(products) && products.length > 0) {
            const productsToInsert = products.map(p => ({
                supplierId: supplier._id,
                productName: p.productName,
                pricePerUnit: p.pricePerUnit,
                minimumOrderQty: p.minimumOrderQty
            }));
            await Product.insertMany(productsToInsert);
        }

        res.status(201).json({
            message: 'Supplier and products created successfully',
            data: supplier
        });
    } catch (err) {
        console.error('Error creating supplier and products:', err);
        res.status(500).json({ error: 'Failed to create supplier and products', details: err });
    }
};
const logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.status(204).json({ message: "No Content" })
    }
    res.clearCookie("jwt", {
        httpOnly: true
    })
    res.json("you logg out")
}
module.exports = { login, loginEveryone, registerOwner, registerSupplier, registerSupplierWithProducts, refresh, logout }