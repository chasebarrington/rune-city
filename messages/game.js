const blackjack = require("./games/blackjack");

function handle(msg, ws) {
    switch (msg.game_type) {
        case 'blackjack':
            blackjack.handle(msg, ws);
        default:
            break;
    }
}

module.exports = {
    handle
}