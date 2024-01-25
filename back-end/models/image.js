const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    clickLocation: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    },
    hitboxSize: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    }
});
//get random
imageSchema.statics.findRandom = function (callback) {
    console.log("Executing")
    this.countDocuments(function (err, count) {
        if (err) {
            return callback(err);
        }
        const rand = Math.floor(Math.random() * count);
        this.findOne().skip(rand).exec(function (err, randomImage) {
            if (err) {
                return callback(err);
            }
            callback(null, randomImage);
        });
    }.bind(this));
};

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
