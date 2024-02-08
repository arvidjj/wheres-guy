const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userScore = new Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

const UserScore = mongoose.model('UserScore', userScore);

module.exports = UserScore;
