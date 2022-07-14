const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require('../models/campground');

const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});

module.exports.index = async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req,res,next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const campground = new Campground(req.body.campground);  
    campground.geometry= geoData.body.features[0].geometry;
    campground.images = req.files.map( f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground.images,campground);
    req.flash('success','Successfully created a campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.show = async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate(
        { 
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Campground not found.')
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {campground});
}

module.exports.renderEditForm = async (req,res,next) =>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Campground not found.')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.update = async (req,res,next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
    const img = req.files.map(f => ({filename: f.filename, url: f.path}));
    campground.images.push(...img);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images :{filename: { $in : req.body.deleteImages} } } } );
    }
    await campground.save();
    req.flash('success','Successfully edited the campground.')
    res.redirect(`/campgrounds/${campground._id}`)
    
}

module.exports.delete = async (req,res,next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the campground.')
    res.redirect('/campgrounds');
}