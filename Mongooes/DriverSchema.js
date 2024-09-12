const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    mobileNumber: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number]
    },
    online: {
        type: Boolean,
        default: false
    },
    inProgress: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    rideCount: {
        type: Number,
        default: 0
    },
    rating : {
        type : Number,
        default : 0
    },
    verify: {
        type: Boolean,
        default: false
    },
    vehSegment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleSegment"
    },
    vehName : {
        type : String,
        trim : true
    },
    vehNumber: {
        type: String,
        trim: true
    },
    licenceNumber: {
        type: String,
        trim: true
    },
    aadhaarNumber: {
        type: String,
        trim: true
    },
    rzpay_custId: {
        type: String,
        trim: true
    },
    qrcode: {
        type: String,
        trim: true
    },
    qrcode_Id: {
        type: String,
        trim: true
    },
    fcmToken : {
        type : String,
        trim : true
    }
}, { timestamps : true });

driverSchema.index({ location : "2dsphere" });

module.exports = mongoose.model("Driver", driverSchema);