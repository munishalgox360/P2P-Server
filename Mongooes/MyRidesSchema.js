const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const myRidesHistorySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver"
  },
  pickupLocaton: {
    type : {
      type : String,
      default : "Point"
    },
    coordinates : [Number]
  },
  dropLocation: {
    type : {
      type : String,
      default : "Point"
    },
    coordinates : [Number]
  },
  distance: {
    type: Number,
    required: true
  },
  amount: {
    type: Number
  },
  accept : {
    type : Boolean,
    default : false
  },
  start: {
    type : Boolean,
    default : false
  },
  completed: {
    type: Boolean,
    default: false
  },
  confirm: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: "comment"
  }
}, { timestamps: true });



module.exports = mongoose.model("MyRides", myRidesHistorySchema);