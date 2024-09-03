const crypto = require("crypto");


// New OTP
function NewOTP() {
    let OTP = "";
    for (let i = 1; i <= 4; i++) {
      OTP = OTP + (Math.floor(Math.random() * 10));
    }
    return OTP;
};



// New Token Number
function generateCouponCode() {
  const randomBytes = crypto.randomBytes(2).toString("hex").toUpperCase();
  const couponCode = `P2P${randomBytes}`;
  return couponCode;
};


module.exports = { NewOTP, generateCouponCode };
  