const WebSocket = require('ws');
const user = require('../model/user');

let bets = [];

function send_history(ws) {
    setTimeout(() => {
        ws.send(JSON.stringify(bets));
    }, 1000);
}

function send(user, bet, type, win, tie, wss){

    let payout = 0;
    if(win)
        payout = bet * 2;
    else if(tie)
        payout = bet; 

    const message = {
        type: 'bet',
        game_type: type,
        user: user,
        bet: bet,
        payout: payout
    }

    // if bets is greater than 7, remove first element
    if(bets.length > 6)
        bets.shift();

    bets.push(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });

}

module.exports = {
    send_history, send
};