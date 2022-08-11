const blackjack = require("./games/blackjack");

function handle(msg, ws, wss) {
    switch (msg.game_type) {
        case 'blackjack':
            blackjack.handle(msg, ws, wss);
        default:
            break;
    }
}

module.exports = {
    handle
}