const jwt = require("jsonwebtoken");
const WebSocket = require('ws');

let msgs = [];

function send_history(ws) {
    console.log(msgs);
    setTimeout(() => {
        ws.send(JSON.stringify(msgs));
    }, 1000);
}

function say(message, ws, wss) {

    // get jwt token from client
    const token = message.token;

    // verify jwt token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return console.log('invalid token');
        }
        message.user = decoded.user;
    } );

    if(!message.user) {
        return ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid token'
        }));
    }

    let new_msg = {
        type: 'message',
        msg: message.msg,
        user: message.user
    }
    
    if (msgs.length > 100) {
        msgs.shift();
    }
    msgs.push(new_msg);

    // send message to client
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(new_msg));
        }
    });
}

module.exports = {
    send_history, say
};