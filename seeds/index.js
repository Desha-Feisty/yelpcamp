const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main()
.then(seedDB)
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
    
    console.log("connected");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;
async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let randThou = Math.floor(Math.random() * 1000);
        const camp = await new Campground({
            location: `${cities[randThou].city}, ${cities[randThou].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
                        geometry: {
                type: "Point",
                coordinates: [
                    cities[randThou].longitude,
                    cities[randThou].latitude,
                ]
            },
            image: [
                {
                    url: "https://res.cloudinary.com/disfsizmf/image/upload/v1758888416/yelpcamp/iqjhv9teuzspqeavzrse.webp",
                    filename: "yelpcamp/iqjhv9teuzspqeavzrse",
                },
                {
                    url: "https://res.cloudinary.com/disfsizmf/image/upload/v1758888415/yelpcamp/diewzbx6ji2dggk6tjvp.webp",
                    filename: "yelpcamp/diewzbx6ji2dggk6tjvp",
                },
            ],
            description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium illum suscipit mollitia magni blanditiis ut minima quae veniam laborum!",
            price: price,
            author: "6893e2f0c09bcef7c1305fa9",
        });
        await camp.save();
    }
    console.log("finished");
    mongoose.connection.close();
}
