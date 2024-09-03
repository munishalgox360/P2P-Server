const express = require("express");
const router = express.Router();
const UserSchema = require("../Mongooes/UserSchema.js");
const DriverSchema = require("../Mongooes/DriverSchema.js");
const { accessToken, verifyToken, verifyDriver } = require("../Middlewares/auth.js");
const bcrypt = require("bcryptjs");
const { NewOTP } = require("../Helpers/OTP-Token.js");
const NotifyService = require("../Helpers/NotificationService.js");
const { NewQrCode } = require("../Helpers/Payment.js");
const date = new Date();



router.post("/register/passenger", async (req, res) => {
  try {
    let { firstName, lastName, mobileNumber, email, password } = req.body;

    const valid = [firstName, lastName, mobileNumber, email, password].some(v => v.trim() == "");
    if(valid){
        return res.status(200).json({ status: 401, message: "All Fields Required" });
    }

    const passengerExist = await UserSchema.findOne({ $or : [{ email : email }, { mobileNumber : mobileNumber }] });
    if (passengerExist) {
      return res.status(200).json({ status: 401, message: "Already Exists" });
    }

    //password encryption
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

   
    const NewPassenger = new UserSchema({
      firstName, lastName, mobileNumber, password, email,
      isAdmin : req.body.isAdmin || false,
      location: {
        type: "Point",
        coordinates : [0,0]
      }
    });

    const createResponse = await NewPassenger.save();
    
    if (createResponse) {
      return res.status(200).json({ status: 201, message: "Success", data: createResponse });
    } else {
      return res.status(200).json({ status: 401, message: "Not Created", data: createResponse });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Registeration Failed(50)" });
  }
});

router.post("/register/driver", async (req, res) => {
  try {
    let { firstName, lastName, mobileNumber, email, password, vehName, vehNumber, vehSegment, licenceNumber, aadhaarNumber } = req.body;

    const valid = [firstName, lastName, mobileNumber, email, password, vehName, vehNumber, vehSegment, licenceNumber, aadhaarNumber].some(v => v.trim() == "");
    if(valid){
        return res.status(200).json({ status: 401, message: "All Fields Required" });
    }

    const passengerExist = await DriverSchema.findOne({ $or : [{ email : email }, { mobileNumber : mobileNumber }] });
    if (passengerExist) {
      return res.status(200).json({ status: 401, message: "Already Exists" });
    }

    //password encryption
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

    
    const NewDriver = new DriverSchema({
      firstName, lastName, mobileNumber, email, password, 
      vehName, vehNumber, vehSegment, licenceNumber, aadhaarNumber, 
      verify : true,
      location: {
        type: "Point",
        coordinates : [0,0]
      }      
    });

    const createResponse = await NewDriver.save();

    if (createResponse) {
      return res.status(200).json({ status: 201, message: "Success", data: createResponse });
    } else {
      return res.status(200).json({ status: 401, message: "Not Created", data: createResponse });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Registeration Failed(91)" });
  }
});

router.post("/login", async (req, res) => {
  const { mobileNumber, password, usertype } = req.body;
  let userDetail;

  try {
    const valid = [mobileNumber, password, usertype].some(v => v.trim() == "");
    if(valid){
        return res.status(200).json({ status: 401, message: "All fields required" });
    }

    if(usertype == "driver"){
      userDetail = await DriverSchema.findOne({ mobileNumber : mobileNumber });
    }else{
      userDetail = await UserSchema.findOne({ mobileNumber : mobileNumber });
    }
    

    if (!userDetail) {
      return res.status(200).json({ status: 401, message: usertype + "Not Found" });
    }

    const isPassword = await bcrypt.compare(password, userDetail.password);
    if (!isPassword) {
      return res.status(200).json({ status: 401, message: "Incorrect password" });
    }

    // Token for Authentication
    const token = await accessToken(userDetail);
    res.status(200).json({ status: 201, message: "Success", token: token, data: userDetail });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Login Failed(125)" });
  }
});

// Verify & qrCode
router.put("/verifydriver", verifyToken,  async (req, res) => {
  const driverId  = req.body.driverId;
  const verify = Boolean(req.body.verify); 
    
  try {
    const driverExist = await DriverSchema.findById({ _id : driverId });
    if(!driverExist){
      return res.status(200).json({ status : 401, message : "Not Found"});
    }

    // const { customer, qrcode } = await NewQrCode(driverExist);

    const fieldToUpdate = {
      verify : verify,
      // rzpay_custId : customer._id,
      // qrcode_Id : qrcode._id,
      // qrcode : qrcode.image_url
    }

    const driverDetail = await DriverSchema.findByIdAndUpdate({ _id : driverId }, fieldToUpdate, { new : true });
    if(!driverDetail){
      return res.status(200).json({ status : 401, message : "Not Updated" });
    }

    res.status(200).json({ status : 201, message : "Success", data : driverDetail });
  } catch (error) {
    res.status(500).json({ error: error.message, message : "Not Verified - Failed(156)" });
  }
});



router.get("/passengerinfo/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
   
  try {
      const passenger = await UserSchema.findById({ _id : id }); 
      if(!passenger){
        return res.status(200).json({ status: 401, message: "Passenger Not Found" });
      }
  
      return res.status(200).json({ status: 201, message: "Success", data: passenger });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Fetch User Info - Failed(173)" });
  }
});

router.get("/driverinfo/:id", verifyDriver, async (req, res) => {
  const id = req.params.id;
   
  try {
      const driver = await DriverSchema.findById({ _id : id }).populate("vehSegment"); 
      if(!driver){
        return res.status(200).json({ status: 401, message: "Driver Not Found" });
      }
  
      return res.status(200).json({ status: 201, message: "Success", data: driver });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Fetch User Info - Failed(188)" });
  }
});

router.get("/getlist", verifyToken, async (req, res) => {
  const usertype = req.query.selectedType;
  const page = Number(req.query.page);
  let records;

  try {
    if(usertype == "driver"){
      records = await DriverSchema.countDocuments();
      userDetail = await DriverSchema.find({}).skip((1 - page) * 20).limit(20).populate("vehSegment"); 
    }else{
      records = await UserSchema.countDocuments();
      userDetail = await UserSchema.find({}).skip((1 - page) * 20).limit(20); 
    }
  
    const pages = Math.ceil(records/20);
    res.status(200).json({ status: 201, message: "Success", count: records, pages : pages, data: userDetail });

  } catch (error) {
    res.status(500).json({ error: error.message , message: "Failed to Get" + usertype + (210) });
  }
});




// Duty ON / OFF
router.put("/dutystatus/:id", verifyDriver, async (req, res) => {
  const id = req.params.id;
  const status = Boolean(req.body.status);

  try {
    const updateResp = await DriverSchema.findByIdAndUpdate({ _id : id }, { online : status }, { new : true });
    if(!updateResp){
      return res.status(200).json({ status: 401, message: "Not Updated" });  
    }
    
    res.status(200).json({ status: 201, message: "Success", data: updateResp });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Not Updated - Failed(230)" });
  }
});




// Update
router.put("/passengerlocation/:id", verifyToken, async (req, res) => {
  const { longitude, latitude } = req.body;
  const id = req.params.id;

  try {
    const location = {
      type : "Point",
      coordinates : [ longitude, latitude ]    // First Longitude -- Second Latitude
    };

    const locationUpdate = await UserSchema.findByIdAndUpdate({ _id : id }, { location }, { new : true });
    if(!locationUpdate){
      return res.status(200).json({ status : 401, message : "Location Not Updated" });  
    }

    res.status(200).json({ status : 201, message : "Success", data : locationUpdate });
  } catch (error) {
      res.status(500).json({ error:  error.message, message : "Not Updated - Failed(255)" });
  }
});

router.put("/driverlocation/:id", verifyDriver, async (req, res) => {
  const { longitude, latitude } = req.body;
  const id = req.params.id;

  try {
    const location = {
      type : "Point",
      coordinates : [ longitude, latitude ]    // First Longitude -- Second Latitude
    };

    const locationUpdate = await DriverSchema.findByIdAndUpdate({ _id : id }, { location }, { new : true });
    if(!locationUpdate){
      return res.status(200).json({ status : 401, message : "Location Not Updated" });  
    }

    res.status(200).json({ status : 201, message : "Success", data : locationUpdate });
  } catch (error) {
      res.status(500).json({ error:  error.message, message : "Not Updated - Failed(276)" });
  }
});






router.put("/update/passenger/:id",  async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName } = req.body;
    
    const updateField = { firstName, lastName, email };
    const updateResponse = await UserSchema.findByIdAndUpdate({ _id : userId }, updateField, { new : true });

    if(!updateResponse){
      return res.status(200).json({ status : 401, message : "Not Updated" });
    }

    res.status(200).json({ status: 201, message: "Success", data: updateResponse });
  } catch (error) {
    res.status(500).json({ error: error.message, message:  "Not Updated - Failed(299)" });
  }
});

router.put("/update/driver/:id",  async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName } = req.body;
    
    const updateField = { firstName, lastName, email };
    const updateResponse = await UserSchema.findByIdAndUpdate({ _id : userId }, updateField, { new : true });

    if(!updateResponse){
      return res.status(200).json({ status : 401, message : "Not Updated" });
    }

    res.status(200).json({ status: 201, message: "Success", data: updateResponse });
  } catch (error) {
    res.status(500).json({ error: error.message, message:  "Not Updated - Failed(317)" });
  }
});



 

// Send Passanger/User OTP
router.get("/sendOTP/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const passengerInfo = await UserSchema.findById(_id);
    if (!passengerInfo) {
      res.status(200).json({ status: 401, message: "Passenger not found" });
    };

    const otp = NewOTP();
    const passenger = await UserSchema.findByIdAndUpdate(_id, { otp: otp }, { new: true });
    
    // Send OTP Using 
    const body = {
      otp : otp,
      message : `Hi! ${passenger.firstName}, Your Verification OTP`
    };

    
    // const sendOTP = await NotifyService("message",body);

    // if(sendOTP){
    //   res.status(200).json({ status: 201, message : "Success", data : sendOTP });
    // };

  } catch (error) {
    res.status(500).json({ error: "Failed to send otp", message: error.message });
  }
});



module.exports = router;










// if(distance == 500){ // 50 meter
      //     await MyRidesSchema.findByIdAndUpdate(_id, { completed : true }, { new : true });

      //     return res
      //     .status(200)
      //     .json({ status : 201,  alert : "Ride Completed" , data : locationUpdate });    
      // }




// res.setHeader("Content-Type", "application/json");