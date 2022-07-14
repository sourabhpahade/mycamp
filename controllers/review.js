const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.create = async (req,res,next) =>  {
    const review = new Review(req.body.review); 
    const campground = await Campground.findById(req.params.id);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully created a review.')
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.delete = async (req,res,next)=> {
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{ $pull : {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review.')
    res.redirect(`/campgrounds/${id}`);

}