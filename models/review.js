const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    body:{
        type:String
    },
    rating:{
        type: Number
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const review = mongoose.model('Review',ReviewSchema);

module.exports = review;