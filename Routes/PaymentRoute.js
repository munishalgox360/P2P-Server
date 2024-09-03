const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middlewares/auth.js");
// const UserSchema = require("../Mongooes/UserSchema.js");
// const PaymentHistory = require("../Mongooes/PaymentHistory.js");
const { Rzpay } = require("../Helpers/Payment.js");




router.get("/transaction/:id/history", verifyToken, async (req, res) => {
  const id = req.params.id;

  const history = await Rzpay.qrCode.fetch(id);
  if(history.length < 1){
    return res.status(200).json({ status : 401, message : "Empty Transaction's History" });
  }

  res.status(200).json({ status : 200, message : "fetch successfully", data : history });
});




// router.put("/qrcode/:id", verifyToken, async (req, res) => {
//   const userId = req.params.id;
  
//   try {
//     const userExist = await AllUserData.findById({ _id : userId });
//     if(!userExist){
//       return res.status(200).json({ status : 401, message : "User Not Found"});
//     }

//     const { customer, qrcode } = await NewQrCode(userExist);

//     const fieldToUpdate = {
//       rzpay_custId : customer._id,
//       qrcode_Id : qrcode._id,
//       qrcode : qrcode.image_url
//     }

//     const user = await AllUserData.findByIdAndUpdate({ _id : userId }, fieldToUpdate, { new : true });
//     res.status(200).json({ status : 201, message : "Success", data : user });
//   } catch (e) {
//     res.status(500).json({ error: "Failed to getting Payment data" });
//   }
// });


module.exports = router;

