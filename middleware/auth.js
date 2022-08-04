const jwt = require("jsonwebtoken");

// verify jwt token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    // check if token is provided
    if(!token)
        return res.status(401).send("No token provided");

    // check if token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Failed to validate token");
        }
        req.decoded = decoded;
    });

    return next();
}

module.exports = verifyToken;