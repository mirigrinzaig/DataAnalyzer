const Owner = require('../models/Owner');
const Supplier = require('../models/Supplier');
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
    
    const accessToken = jwt.sign({ id: user._id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userName: foundUser.userName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000
    })
    res.json({ accessToken: accessToken })
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
            return res.status(201).json({ message: "The user " + user.phoneNumber + " created" })
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
        const { companyName, phoneNumber, representativeName, password } = req.body;
        //required fields
        if (!phoneNumber || !password)
            return res.status(400).json({ message: "נא למלא את כל השדות" })
        //uniqe field
        const duplicate = await Supplier.findOne({ phoneNumber }).lean()
        if (duplicate)
            return res.status(409).json({ message: "המספר קיים במערכת" })
        //bcrypt-password
        const hashPass = await bcrypt.hash(password, 10)
        const updateSupplier = { password: hashPass, phoneNumber,companyName,representativeName }
        const supplier = await Supplier.create(updateSupplier)

        if (supplier) {
            return res.status(201).json({ message: "The supplier " + user.companyName + " created" })
        }
        else {
            return res.status(400).json({ message: "Sorry, there is a mistake...." })
        }
    } catch (err) {
        console.log(err)
    }
}
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
module.exports = { login, registerOwner,registerSupplier, refresh, logout }