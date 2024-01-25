const mongoose = require('mongoose');



const Schema = mongoose.Schema;


const clicklocationSchema = new Schema({
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
});



const ClickLocation = mongoose.model('ClickLocation', clicklocationSchema);

module.exports = ClickLocation;
