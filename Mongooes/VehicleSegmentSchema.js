const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const vehicleSegmentSchema = new mongoose.Schema({
    admin : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    vehSegment : {
        type : String,
        trim : true
    },
    pricePer_km : {
        type : Number
    },
    basePrice : {
        type : Number
    },
    capacity : {
        type : Number
    },
    image : {
        type : String,
        trim : true
    },
    deleted : {
        type : Boolean,
        default : false
    }
},{ timestamps : true });


module.exports = mongoose.model("VehicleSegment",vehicleSegmentSchema);
