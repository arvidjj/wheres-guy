const mongoose = require('mongoose');



const Schema = mongoose.Schema;


const imageSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    clickLocation: {
        type: Schema.Types.ObjectId,
        ref: 'ClickLocation',
        required: true
    },
    hitboxSize: {
        type: Schema.Types.ObjectId,
        ref: 'Hitbox',
        required: true
    }
});



const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
