if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ quiet: true });
}

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

async function findCoordinates() {
    // in an async function, or as a 'thenable':
    const geoData = await maptilerClient.geocoding.forward("paris");
    console.log(geoData.features[0]);
}

findCoordinates();
