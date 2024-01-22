const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    clickLocation: {
        type: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    hitboxSize: {
        type: {
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            }
        },
        required: true
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
