// user model
const _user = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function handle(msg, ws) {
    switch (msg.action) {
        case 'login':
            login(msg, ws);
            break;
        case 'register':
            register(msg, ws);
            break;
        default:
            break;
    }
}

async function register(msg, ws) {
    
    const user = msg.username;
    const password = msg.password;
    const email = msg.email;
    const rsn = msg.rsn;

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
            return ws.send(JSON.stringify({
                type: 'error',
                message: 'user already exists'
            }));
        }
        if (userExists.email === email) {
            return ws.send(JSON.stringify({
                type: 'error',
                message: 'email already exists'
            }));
        }
        if (userExists.rsn === rsn) {
            return ws.send(JSON.stringify({
                type: 'error',
                message: 'rsn already exists'
            }));
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
    return ws.send(JSON.stringify({
        type: 'auth',
        token,
        user: {
            user: newUser.user,
            email: newUser.email,
            rsn: newUser.rsn,
            balance: newUser.balance,
        }
    }));
}

async function login(msg, ws) {

    const user = msg.username;
    const password = msg.password;

    console.log('got here')

    // validate user input
    if (!user || !password) {
        return ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid input'
        }));
    }

    // check if user exists in mongodb
    const userExists = await _user.findOne({ user });
    if (!userExists) {
        return ws.send(JSON.stringify({
            type: 'error',
            message: 'invalid user or password'
        }));
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return ws.send(JSON.stringify({
            type: 'error',
            message: 'invalid user or password'
        }));
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
    return ws.send(JSON.stringify({
        type: 'auth',
        token,
        user: {
            uid: userExists._id,
            user: userExists.user,
            email: userExists.email,
            rsn: userExists.rsn,
            balance: userExists.balance,
        }
    }));

}

module.exports = {
    handle
};