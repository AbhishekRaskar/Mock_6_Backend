const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../Models/userModel");
const userRouter = express.Router();
require("dotenv").config();



userRouter.post("/register", async (req, res) => {
    const { password, email, avatar, name } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({ msg: "User already Exists..." });
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                } else {
                    const user = new userModel({ ...req.body, password: hash });
                    await user.save();
                    res.status(200).json({ msg: "User has been Registered Successfully....!" });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


userRouter.post("/login", async (req, res) => {
    const { password, email } = req.body
    try {
        const user = await userModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id, name: user.username }, process.env.secret)
                    res.status(200).json({ msg: "User Login successfully....!", token: token });
                }
                else {
                    res.status(400).json({ msg: "Wrong Credentials....!" });
                }
            })
        }
        else {
            res.status(400).json({ msg: "User no Found....!" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = {
    userRouter
}
