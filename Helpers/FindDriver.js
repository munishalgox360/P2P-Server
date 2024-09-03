const DriverSchema = require("../Mongooes/DriverSchema.js");
const mongoose = require("mongoose");

// Filter Drivers within 5km area
// Filter Drivers within 5km area
async function FindDriver(passenger, segment){
    const segmentId = new mongoose.Types.ObjectId(segment);

    const findDriver = [
        { $geoNear: {
                near:  passenger,
                distanceField: "distance", 
                minDistance: 1, maxDistance: 50000, spherical: true
            }
        },
        { $match: { online: true, inProgress: false } }
    ]

    const chooseDriver = await DriverSchema.aggregate(findDriver);
    
    const filter = chooseDriver.filter(driver => {
        return driver.vehSegment.toString() === segmentId.toString();
    })

    return filter[Math.floor(Math.random() * filter.length)];   
};



async function FindAgain(passenger, segment, driverId){
    const driver = new mongoose.Types.ObjectId(driverId);
    const segmentId = new mongoose.Types.ObjectId(segment);

    const findDriver = [
        { $geoNear: {
                near:  passenger,
                distanceField: "distance", 
                minDistance : 1, maxDistance: 50000, spherical: true
            }
        },
        { $match: { _id: { $ne : driver }, online: true, inProgress: false } }
    ]

    const chooseDriver = await UserSchema.aggregate(findDriver);
    
    const filter = chooseDriver.filter(driver => {
        return driver.vehSegment.toString() === segmentId.toString();
    })

    return filter[Math.floor(Math.random() * filter.length)];   
};


module.exports = { FindDriver, FindAgain };
