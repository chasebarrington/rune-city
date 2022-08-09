// user model
const _user = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function handle(msg, ws) {
    switch (msg.action) {
        case 'login':
            login(msg, ws);
            break;
        default:
            break;
    }
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