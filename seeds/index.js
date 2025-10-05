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

const imageSources = [
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/1.jpg",
        filename: "1",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/2.jpg",
        filename: "2",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/3.jpg",
        filename: "3",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/4.jpg",
        filename: "4",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/5.jpg",
        filename: "5",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/6.jpg",
        filename: "6",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/7.jpg",
        filename: "7",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/8.jpg",
        filename: "8",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/9.jpg",
        filename: "9",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/10.jpg",
        filename: "10",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/11.jpg",
        filename: "11",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/12.jpg",
        filename: "12",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/13.jpg",
        filename: "13",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/14.jpg",
        filename: "14",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/15.jpg",
        filename: "15",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/16.jpg",
        filename: "16",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/17.jpg",
        filename: "17",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/18.jpg",
        filename: "18",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/19.jpg",
        filename: "19",
    },
    {
        url: "https://res.cloudinary.com/disfsizmf/image/upload/v1759702579/20.jpg",
        filename: "20",
    },
];

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const generatePrice = () => Math.floor(Math.random() * 140) + 20; // Random price between $20 and $160

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const images = [];
        function seedImage() {
            const numOfImages = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numOfImages; j++) {
                const randomImage = Math.floor(
                    Math.random() * imageSources.length
                );
                images.push({
                    url: imageSources[randomImage].url,
                    filename: `yelpcamp-${i}-${imageSources[randomImage].filename}`,
                });
            }
        }
        seedImage();
        let randThou = Math.floor(Math.random() * 1000);
        const camp = await new Campground({
            location: `${cities[randThou].city}, ${cities[randThou].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randThou].longitude,
                    cities[randThou].latitude,
                ],
            },
            image: images,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium illum suscipit mollitia magni blanditiis ut minima quae veniam laborum!",
            price: generatePrice(),
            author: "6893e2f0c09bcef7c1305fa9",
        });
        await camp.save();
    }
    console.log("finished");
    await mongoose.connection.close();
}
