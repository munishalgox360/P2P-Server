const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type : String,
    trim : true,
    required : true
  },
  lastName: {
    type : String,
    trim : true,
    required : true
  },
  mobileNumber: {
    type : String,
    trim : true,
    required : true
  },
  password: {
    type : String,
    trim : true,
    required : true 
  },
  email: {
    type : String,
    trim : true,
    required : true
  },
  location : {
    type : {
      type : String,
      default : "Point"
    },
    coordinates : [Number]
  },
  lastLogin : {
    type : Date
  },
  rideCount : {
    type : Number,
    default : 0
  },
  isAdmin : {
    type : Boolean,
    default : false
  }
},{ timestamps : true });


userSchema.index({ location : "2dsphere" });

module.exports = mongoose.model("User", userSchema);