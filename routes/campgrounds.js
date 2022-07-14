const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campground')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

const {storage} = require('../cloudinary');

const multer  = require('multer');
const upload = multer({storage});



router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.create))
   

router.get('/new',isLoggedIn, campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateCampground,catchAsync(campground.update))
    .delete(isLoggedIn,isAuthor, catchAsync(campground.delete))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campground.renderEditForm))


module.exports = router;