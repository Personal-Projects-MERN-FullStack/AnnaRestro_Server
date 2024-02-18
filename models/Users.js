const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
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
    },
    wallet: {
        active:{
            type:Boolean,
            default : false
        }
        ,
        coins: {
            type: Number,
            default: 0
        },
        coinsOnHold: {
            type: Number,
            default: 0
        },
        pin: {
            type: Number,
            defualt : null
        }
    },
    basket: {
        type: [Schema.Types.Mixed], // Array of mixed types, can contain any data
        default: []
    }
});
const User  = mongoose.model('user',userSchema);
module.exports = User