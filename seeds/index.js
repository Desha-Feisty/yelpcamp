const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')


main().then(seedDB).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

    console.log("connected")
}

const sample = array => array[Math.floor(Math.random()*array.length)]
const price = Math.floor(Math.random() * 20) + 10
async function seedDB(){
    await Campground.deleteMany({})
    for(let i=0; i < 50; i++){
        let randThou = Math.floor(Math.random()* 1000)
        const camp = await new Campground({
            location: `${cities[randThou].city}, ${cities[randThou].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium illum suscipit mollitia magni blanditiis ut minima quae veniam laborum!',
            price: price
        })
        await camp.save()
    }
    console.log("finished")
    mongoose.connection.close()
}


