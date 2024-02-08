const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreSession = new Schema({
    image: {
        //foreign key
        type: Schema.Types.ObjectId,
        required: true
    },
    guessedCharacters: {
        //integer
        type: Number,
        required: true
    },
    servedAt: {
        type: Date,
        required: true
    },
});

const ScoreSession = mongoose.model('SessionScore', scoreSession);

module.exports = ScoreSession;
