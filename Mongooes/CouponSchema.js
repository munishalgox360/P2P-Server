const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  title : {         // Festival Name
    type : String,
    trim : true,
    required : true
  },
  coupon: {
    type : String,
    trim : true,
    required : true
  },
  discount: {
    type : Number,
    required : true
  },
  active: {
    type : Boolean,
    default : true
  },
  purpose : {     // regular, festival
    type : String,
    trim : true,
    default : "festival"
  }
},{ timestamps : true });

module.exports = mongoose.model("Coupon", couponSchema);
