const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const hitboxSchema = new Schema({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});

const Hitbox = mongoose.model('Hitbox', hitboxSchema);

module.exports = Hitbox;
