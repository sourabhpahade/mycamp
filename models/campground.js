const mongoose = require('mongoose');
const Review = require('./review');

const ImageSchema = new mongoose.Schema({
        
    url: String,
    filename: String
        
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const CampGroundSchema = new mongoose.Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    images: [ImageSchema] ,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },    
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},{toJSON: {virtuals:true}})

CampGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}" > ${this.title}</a>
            <p>${this.location}</p>`;
});


CampGroundSchema.post('findOneAndDelete',async function (campground) {

    if(campground){
        await Review.deleteMany({
            _id: {
                $in : campground.reviews
            }
        })
    }

})


module.exports = mongoose.model('Campground',CampGroundSchema);

