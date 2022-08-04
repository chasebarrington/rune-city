const express = require('express');
const userRoute = express.Router();
const jwt = require("jsonwebtoken");

// user model
const _user = require("../model/user");

userRoute.route("/register").post(async (req, res) => {

    const { 
        user,
        email,
        rsn,
        password,
    } = req.body;

    // validate user input
    if (!user || !email || !rsn || !password) {
        return res.status(400).send("Invalid input");
    }

    // check if user, email or rsn already exists in mongodb
    const userExists = await _user.findOne({
        $or: [
            { user: user },
            { email: email },
            { rsn: rsn }
        ]
    });

    // if found, return which one is already exists
    if (userExists) {
        if (userExists.user === user) {
            return res.status(400).send("User already exists");
        }
        if (userExists.email === email) {
            return res.status(400).send("Email already exists");
        }
        if (userExists.rsn === rsn) {
            return res.status(400).send("RSN already exists");
        }
    }

    // encrypt pass
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user in mongodb
    const newUser = new _user({
        user,
        email,
        rsn,
        balance: 1000,
        password: hash
    });

    // create jwt token
    const token = jwt.sign({
        uid: newUser._id,
        user: newUser.user,
        email: newUser.email,
        rsn: newUser.rsn,
        balance: newUser.balance,
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    // save user to mongodb
    await newUser.save();

    // return user
    return res.status(200).send({ user: {
        user: newUser.user,
        email: newUser.email,
        rsn: newUser.rsn,
        balance: newUser.balance,
    }, token });
});

// login route
userRoute.route("/login").post(async (req, res) => {
    
    const { user, password } = req.body;

    console.log(user, password);

    // validate user input
    if (!user || !password) {
        return res.status(400).send("Invalid input");
    }

    // check if user exists in mongodb
    const userExists = await _user.findOne({ user });
    if (!userExists) {
        return res.status(400).send("Invalid username or password");
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return res.status(400).send("Invalid username or password");
    }

    // create jwt token
    const token = jwt.sign({
        uid: userExists._id,
        user: userExists.user,
        email: userExists.email,
        rsn: userExists.rsn,
        balance: userExists.balance,
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    // return user
    return res.status(200).send({ user: {
        user: userExists.user,
        email: userExists.email,
        rsn: userExists.rsn,
        balance: userExists.balance,
    }, token });
});

module.exports = userRoute;