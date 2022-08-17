const WebSocket = require('ws');

let msgs = [];

function send_history(ws) {
    setTimeout(() => {
        ws.send(JSON.stringify(msgs));
    }, 1000);
}

function say(message, ws, wss) {

    // get jwt token from client
    const token = message.decoded;
    if (!token) {
        return;
    }

    // get user from jwt token
    message.user = token.user;
    
    if(!message.user) {
        return ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid token'
        }));
    }

    let date = new Date();

    // get time in EST timezone
    let time = date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        timeStyle: 'short'
    });

    let new_msg = {
        type: 'message',
        msg: message.msg,
        user: message.user,
        date: time
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