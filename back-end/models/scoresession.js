const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreSession = new Schema({
    image: {
        //foreign key
        type: Schema.Types.ObjectId,
        required: true
    },
    guessedCharacters: {
        type: Number,
        required: true
    },
    servedAt: {
        type: Date,
        required: true
    },
    elapsedTime: {
        type: Number
    },
});

const ScoreSession = mongoose.model('SessionScore', scoreSession);

module.exports = ScoreSession;
