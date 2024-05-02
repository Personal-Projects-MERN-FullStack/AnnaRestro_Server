const mongoose = require('mongoose');
const { Schema } = mongoose;

const sadminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Sadmin = mongoose.model('sadmin', sadminSchema);

module.exports = Sadmin;
