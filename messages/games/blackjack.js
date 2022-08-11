const { performance } = require('perf_hooks');
const bets = require("../bets");

function handle(msg, ws, wss) {
    switch (msg.action) {
        case 'join':
            return find_game(ws, msg, wss);
        case 'hit':
            return hit(ws, msg, wss);
        case 'stand':
            return stand(ws, msg, wss);
        case 'deal':
            return deal(ws, msg, wss);
        default:
            break;
    }
}

// blackjack model
const _blackjack = require("../../model/blackjack");
const _user = require("../../model/user");

let suits = ["♥", "♣", "♦", "♠"];
let faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// calculate value from face
const face_value = (face) => {
    if (face === "A")
        return 11;
    if (face === "J" || face === "Q" || face === "K")
        return 10;
    return parseInt(face);
}

function calculate_hand_value(hand) {
    let value = 0;

    // calculate initial value
    for (let i = 0; i < hand.length; i++) 
        value += face_value(hand[i].face);

    // check if A is in hand and value is over 21
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].face === "A" && value > 21) {
            value -= 10;
        }
    }

    return value;
}

// clone game and remove deck for sending to client
function send_to_client(ws, game, hide_dealer, balance, user, wss){

    if(game.finished && !game.was_requested) {
        bets.send(user, game.bet, 'blackjack', game.win, game.tie, wss)
    }

    return ws.send(JSON.stringify({
        type: 'game',
        game_type: 'blackjack',
        balance: balance,
        game: {
            user: game.user,
            hand: game.hand,
            dealer: hide_dealer ? [game.dealer[1]] : game.dealer,
            bet: game.bet,
            finished: game.finished,
            win: game.win,
            tie: game.tie,
        }}
    ));
}

async function find_game(ws, message, wss){
    
    // check if decoded token is valid
    if (!message.decoded)
        return console.log("invalid token");

    const user = message.decoded.uid;

    // validate user input
    if (!user)
        return console.log("invalid input");

    // check if user exists
    const userExists = await _user.findOne({ _id: user });
    if (!userExists)
        return console.log("invalid user");

    // find game in mongodb
    const game = await _blackjack.findOne({ user: user });

    // if not found, return error
    if (!game)
        return console.log("game not found");

    // if user is not game user, return error
    if (game.user != user)
        return console.log("invalid user");

    // if game is not finished, only send the dealers second card
    if (!game.finished)
        return send_to_client(ws, game, true, userExists.balance, userExists.user, wss);

    game.was_requested = true;
    
    return send_to_client(ws, game, false, userExists.balance, userExists.user, wss);
}

async function hit(ws, message, wss){

    var startTime = performance.now()

    // check if decoded token is valid
    if (!message.decoded)
        return console.log("invalid token");

    const user = message.decoded.uid;

    // validate user input
    if (!user)
        return console.log("invalid input");

    // check if user exists
    const userExists = await _user.findOne({ _id: user });
    if (!userExists)
        return console.log("invalid user");

    // find game in mongodb
    const game = await _blackjack.findOne({ user: userExists._id });

    // if game not found, return 404
    if (!game)
        return console.log("game not found");

    // if user is not the games owner, return 404
    if (game.user !== user)
        return console.log("user is not owner of game");

    // if game is finished, return 404
    if (game.finished)
        return console.log("game is finished");

    // hit card and update game
    const card = game.deck.pop();

    // if card is an ace, and hand value is more than 10, set value to 1
    game.hand.push(card);

    // calculate players hand value
    const hand_value = calculate_hand_value(game.hand);

    // if player is busted, finish game, if it's 21, stand
    if (hand_value > 21) {
        game.finished = true;
    } else if (hand_value === 21) {

        // if dealers hand is less than 17, hit dealer
        while(calculate_hand_value(game.dealer) < 17) {
            const card = game.deck.pop();
            game.dealer.push(card);
        }

        const dealer_value = calculate_hand_value(game.dealer);
        if (hand_value > dealer_value || dealer_value > 21) {
            game.win = true;
            userExists.balance += game.bet * 2;
        } else if (hand_value === dealer_value) {
            game.tie = true;
            userExists.balance += game.bet;
        }

        if(game.win || game.tie) {
            await userExists.save();
        }

        game.finished = true;
    }

    // update game in mongodb
    await game.save();

    var endTime = performance.now()
    console.log(`hit took ${endTime - startTime} milliseconds`)

    // if player is not busted, return game
    return send_to_client(ws, game, true, userExists.balance, userExists.user, wss);
}

async function stand(ws, message, wss){

    var startTime = performance.now()

    // check if decoded token is valid
    if (!message.decoded)
        return console.log("invalid token");

    const user = message.decoded.uid;

    // validate user input
    if (!user)
        return console.log("invalid input");

    const userExists = await _user.findById(user);

    // if user not found, return 404
    if (!userExists)
        return console.log("user not found");
    
    const game = await _blackjack.findOne({ user });

    // if game not found, return 404
    if (!game)
        return console.log("game not found");

    // if game is finished, return 404
    if (game.finished)
        return console.log("game is finished");
    
    // if dealers hand is less than 17, hit dealer
    while(calculate_hand_value(game.dealer) < 17) {
        const card = game.deck.pop();
        game.dealer.push(card);
    }

    // calculate winner
    const playerValue = calculate_hand_value(game.hand);
    const dealerValue = calculate_hand_value(game.dealer);

    // if dealer busted, update user balance
    if (dealerValue > 21) {
        game.win = true;
        userExists.balance += game.bet * 2;
        await userExists.save();
    }

    // if hands are equal, update user balance
    if (playerValue === dealerValue) {
        game.tie = true;
        userExists.balance += game.bet;
        await userExists.save();
    }

    // if player hand is greater than dealer hand, update user balance
    if (playerValue > dealerValue) {
        game.win = true;
        userExists.balance += game.bet * 2;
        await userExists.save();
    }

    // finish game and update game in mongodb
    game.finished = true;
    await game.save();

    var endTime = performance.now()
    console.log(`stand took ${endTime - startTime} milliseconds`)

    // return game back to client
    return send_to_client(ws, game, false, userExists.balance, userExists.user, wss);
}

async function deal(ws, message, wss) {

    var startTime = performance.now()

    // check if decoded token is valid
    if (!message.decoded)
        return console.log("invalid token");
    
    const user = message.decoded.uid;
    const bet = message.bet;

    // validate user input
    if (!user || !bet)
        return console.log("invalid input");

    // check if user exists
    const userExists = await _user.findById(user);

    // if user not found, return 404
    if (!userExists)
        return console.log("user not found");

    // check if game exists for user
    let game = await _blackjack.findOne({ user });

    // if game is found and game not finished, return 404
    if (game && !game.finished)
        return console.log("game not finished");

    // if bet is invalid, return 404
    if (bet < 1 || bet > userExists.balance)
        return console.log("invalid bet");

    // subtract bet from user balance
    userExists.balance -= bet;

    let deck = [];

    // create the cards, and push them onto the deck
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < faces.length; j++) {
            deck.push({ suit: suits[i], face: faces[j], value: face_value(faces[j]) });
        }
    }

    // shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // calculate players hand and dealer hand, one at a time
    const playerHand = [];
    const dealerHand = [];

    // deal two cards to each player
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    
    // check if player or dealer is blackjack
    let playerBlackjack = false;
    let dealerBlackjack = false;
    let finished = false;
    let win = false;
    let tie = false;

    if (calculate_hand_value(playerHand) === 21) {
        playerBlackjack = true;
    }

    if (calculate_hand_value(dealerHand) === 21) {
        dealerBlackjack = true;
    }

    // if player or dealer is blackjack, update user balance and finish game
    if (playerBlackjack || dealerBlackjack) {
        finished = true;
        if (playerBlackjack && dealerBlackjack) {
            tie = true;
            userExists.balance += bet;
        } else if (playerBlackjack) {
            win = true;
            userExists.balance += bet * 2;
        }
    }

    await userExists.save();

    // update game, or create new in mongodb
    if (game && game.finished) {
        game.deck = deck;
        game.hand = playerHand;
        game.dealer = dealerHand;
        game.bet = bet;
        game.finished = finished;
        game.win = win;
        game.tie = tie;
    } else {
        game = new _blackjack({
            user: user,
            deck: deck,
            hand: playerHand,
            dealer: dealerHand,
            bet: bet,
            finished: finished,
            win: win,
            tie: tie
        });
    }

    game.save();

    var endTime = performance.now()
    console.log(`deal took ${endTime - startTime} milliseconds`)

    if(finished)
        return send_to_client(ws, game, false, userExists.balance, userExists.user, wss);

    // send game back to client
    return send_to_client(ws, game, true, userExists.balance, userExists.user, wss);
}

module.exports = {
    handle
};