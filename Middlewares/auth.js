const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.secret);
            console.log("decoded : ", decoded)
            if (decoded) {
                req.body.username = decoded.username; 
                req.body.userID = decoded.userID;
                next();
            } else {
                res.status(400).json({ msg: "Not Authorized..." });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(400).json({ msg: "Please Login....!" });
    }
};

module.exports = {
    auth
};
