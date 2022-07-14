const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/my-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("seed db connected");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30);
    const camp = new Campground({
      author: "62ae1b885185e3a0198d83eb",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure mollitia quaerat in quibusdam quidem quis tempora ipsam odio veritatis, porro assumenda ipsa illo alias accusamus recusandae, fugiat libero. Earum, reprehenderit!",
      images: [
        {
          url: "https://res.cloudinary.com/sourabhcloudinary/image/upload/v1656189065/MyCamp/xxst3v8csdjfyvszs58r.jpg",
          filename: "MyCamp/r8jzur5tyqh22j8itcri",
        },
      ],
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
