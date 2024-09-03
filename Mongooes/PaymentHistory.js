const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const paymentHistory = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver"
  },
  totalPrice: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    trim: true,
    required: true
  },
  paymentMode: {
    type: String,
    trim: true,
    required: true
  },
  paymentAt: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

module.exports = mongoose.model("PaymentHistory", paymentHistory);
