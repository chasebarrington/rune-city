const mongoose = require("mongoose");

const blackjackSchema = new mongoose.Schema({
    user: { type: String, unique: true },
    deck: [{
        suit: { type: String },
        face: { type: String },
        value: { type: Number }
    }],
    hand: [{
        suit: { type: String },
        face: { type: String },
        value: { type: Number }
    }],
    dealer: [{
        suit: { type: String },
        face: { type: String },
        value: { type: Number }
    }],
    bet: { type: Number },
    finished: { type: Boolean, default: false },
    win: { type: Boolean, default: false },
    tie: { type: Boolean, default: false }
});

module.exports = mongoose.model("blackjack", blackjackSchema);