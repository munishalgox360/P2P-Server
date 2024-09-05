const express = require("express");
const router = express.Router();
const { verifyToken, verifyDriver } = require("../Middlewares/auth.js");
const MyRidesSchema = require("../Mongooes/MyRidesSchema.js");
const UserSchema = require("../Mongooes/UserSchema.js");
const { FindDriver, FindAgain } = require("../Helpers/FindDriver.js");
const { NewOTP } = require("../Helpers/OTP-Token.js");
const NotifyService = require("../Helpers/NotificationService.js");
const SocketConfg = require("../Helpers/websocket.js");
const DriverSchema = require("../Mongooes/DriverSchema.js");




// Book New Ride 
router.post("/create", verifyToken, async (req, res) => {
    const { userId, vehsegment, pickupLocaton, dropLocation, distance, amount } = req.body;
    
    try {
        const ridePayload = {
            userId : userId,
            pickupLocaton : {
                type : "Point",
                coordinates : pickupLocaton
            },
            dropLocation: {
                type: "Point",
                coordinates : dropLocation
            },
            distance : distance,
            amount : amount
        };

        const Driver =  await FindDriver(ridePayload.pickupLocaton, vehsegment);
        if(!Driver){
            return res.status(200).json({ status: 401, message: "Driver not found" });
        }

        // Send Ride Notification
        const rideRequest = await MyRidesSchema.create(ridePayload);
        
        try {
            const resp = await SocketConfg.SendMessage(Driver._id, "newride", { msg:"AcceptRide", rideId : rideRequest._id });
            if (resp) {
                return res.status(200).json({ status: 200, message: "Notification has been sent to Driver", rideDetail: rideRequest });
            } else {
                return res.status(200).json({ status: 401, message: "Failed to send Notification to Driver", rideDetail: rideRequest });
            }
        } catch (error) {
            console.error("CREATE RIDE :: sending socket message:", error);
            return res.status(500).json({ error: "CREATE RIDE :: Failed to send socket message", message: error.message });
        }

    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to Create Ride Request" });
    }
});



// Get ride by Id
router.get("/ride/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const Ride = await MyRidesSchema.findById({ _id : id }).populate("userId").populate("driverId");
        if(!Ride){
            return res.status(200).json({ status : 401, message : "Not Found", data : Ride });
        };

        res.status(200).json({ status: 201, message: "Success", data: Ride });

    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to Get Ride" });
    }
});



// rating of each ride by passenger
router.put("/rating/:id", verifyToken, async (req, res) => {
    const { rating, comment } = req.body;
    const id = req.params.id;

    try {
        const payload = {
            rating : Number(rating),
            comment : comment
        }

        const ratingResponse = await MyRidesSchema.findByIdAndUpdate({ _id : id }, payload, { new : true });
        if(!ratingResponse){
            return res.status(200).json({ status : 401, message : "Failed" });
        }
            
        return res.status(200).json({ status : 201, message : "Success", data : ratingResponse });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to give rating" });
    }
});



// Accept Ride --- Driver Side
router.put("/accept/:rideId/:driverId", verifyDriver, async (req, res) => {
    const { rideId, driverId } = req.params;
    const accept = Boolean(req.body.accept);

    try {
        const acceptBy = {
            driverId : driverId,
            accept : accept
        };

        const Ride = await MyRidesSchema.findByIdAndUpdate({ _id : rideId }, acceptBy, { new : true });

        if(Ride.accept){ //Accepted
            try {
                const resp = await SocketConfg.AcceptRideMessage(Ride.userId, { msg:"Accepted", rideId : Ride._id });
                if (resp) {
                    return res.status(200).json({ status: 201, message : "Ride Accepted", data : Ride });
                } else {
                    return res.status(200).json({ status: 401, message: "Failed to Accepted" });
                }
            } catch (error) {
                console.error("ACCEPT RIDE :: sending socket message:", error);
                return res.status(500).json({ error: "ACCEPT RIDE :: Failed to send socket message", message: error.message });
            }
        }
        else{ //Rejected
            const vehicle = await UserSchema.findById({ _id : driverId });
            const Driver =  await FindAgain(Ride.pickupLocaton, vehicle.vehicleSegment, driverId);

            if(Driver){
                return res.status(200).json({ status: 401, message: "Driver not found" });
            }

            // Send Notification
            try {
                const resp = await SocketConfg.SendMessage(Driver._id, "newride" ,{ msg: "AcceptRide", rideId: Ride._id });
                if (resp) {
                    return res.status(200).json({ status: 200, message: "Notification has been sent to Driver", data : Ride });
                } else {
                    return res.status(200).json({ status: 401, message: "Failed to send Notification to Driver", data : Ride });
                }
            } catch (error) {
                console.error("Error sending socket message:", error);
                return res.status(500).json({ error: "REJECT RIDE :: Failed to send socket message", message: error.message });
            }
        }     
        // Send OTP on passenger device
        // const passengerInfo = await UserSchema.findById({ _id : acceptRide.userId});
        // if (!passengerInfo) {
        //     return res.status(200).json({ status: 401, message: "Passenger not found" });
        // };
    

        // const otp = NewOTP();
        // const passenger = await UserSchema.findByIdAndUpdate(
        //     { _id : acceptRide.userId}, 
        //     { otp: otp }, 
        //     { new: true }
        // );
        
        // const message = (
        //   `P2P - Hi! ${passenger.firstName}, Your Verification OTP is : ${otp}`
        // );
    
        // const sendOTP = await NotifyService("message",message);
    
        // if(sendOTP){
        //   res.status(200).json({ status: 201, message : "Ride Accept Successfully", data : passenger });
        // };
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to Accept Ride" });
    }
});



// Confirm Ride by Id -- Passenger Side
router.put("/confirm/:id", verifyToken, async (req, res) => {
    const id  = req.params.id;
    const confirm = req.body.confirm;

    try {
        const confirmRide = await MyRidesSchema.findByIdAndUpdate({ _id : id }, { confirm : Boolean(confirm) }, { new : true });
        
        if(!confirmRide.confirm){
            try {
                const resp = await SocketConfg.CandelRide(confirmRide.driverId, { msg:"cancel", rideId : confirmRide._id });
                if (resp) {
                    return res.status(200).json({ status: 201, message: "Ride Cancel Successfully", data: confirmRide });
                } else {
                    return res.status(401).json({ status: 401, message: "Failed to Cancel" });
                }
            } catch (error) {
                console.error("CANCEL RIDE :: sending socket message:", error);
                return res.status(500).json({ error: "ACCEPT RIDE :: Failed to send socket message", message: error.message });
            }
            
        }else{
            try {
                const resp = await SocketConfg.StartRide(confirmRide.driverId, { msg:"start", rideId : confirmRide._id });
                if (resp) {
                    const rideDetails = await MyRidesSchema.findById({ _id : confirmRide._id }).populate("userId").populate("driverId");
                    return res.status(200).json({ status: 201, message: "Ride Confirmed Successfully", data: rideDetails });
                } else {
                    return res.status(401).json({ status: 401, message: "Failed to Start Ride" });
                }
            } catch (error) {
                console.error("ACCEPT RIDE :: sending socket message:", error);
                return res.status(500).json({ error: "CONFIRM RIDE :: Failed to send socket message", message: error.message });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message , message: "Failed to Cancel" });
    }
});



// Complete Ride --- Driver Side
router.get("/completeRide/:id", verifyDriver, async (req, res) => {
    const _id = req.params.id;

    try {
        const fieldToUpdate = {
            completed : true,
            start : false,
            accept : false
        };

        const rideComplete = await MyRidesSchema.findByIdAndUpdate(_id, fieldToUpdate, { new : true });
        if(!rideComplete){
            return res.status(200).json({ status : 401, message : "Ride not found" });
        }

        // Driver 

        // total rides of deiver
        const totalRides = await MyRidesSchema.find({ driverId : RideInProgress.driverId });
        let sum = 0; let avg = 0;
        
        for(let i = 0; i <= totalRides.length; i++){
          sum += totalRides[i].rating;
        }
    
        const driverPayload = { 
            inProgress : false, 
            $inc : { rideCount : 1 },
            rating : (sum/totalRides.length).toFixed(1)    
        }

        const RideInProgress = await DriverSchema.findByIdAndUpdate({ _id : rideComplete.driverId }, driverPayload, { new : true });
        if(!RideInProgress){
            return res.status(200).json({ status : 401, message : "Failed to update driver's status" });
        };

  

        //Passenger
        // Increase Ride Count 
        const RideCount = await UserSchema.findByIdAndUpdate({ _id : rideComplete.userId }, { $inc : { rideCount : 1 }}, { new : true });
        if(!RideCount){
            return res.status(200).json({ status : 401, message : "Fail to increasse ride count" });
        };


        // Assign Normal Coupon to Passenger after completed 5 rides
        // '' '' '' 

        // Notify for rating
        try {
            const resp = await SocketConfg.SendMessage(rideComplete.userId, "rating", { msg:"Rating", rideId : rideComplete._id });
            if (resp) {
                return res.status(200).json({ status : 201, message : "Success", data : rideComplete });
            } else {
                return res.status(200).json({ status: 401, message: "Failed to Accepted" });
            }
        } catch (error) {
            console.error("ACCEPT RIDE :: sending socket message:", error);
            return res.status(500).json({ error: "ACCEPT RIDE :: Failed to send socket message", message: error.message });
        }

    } catch (error) {
        res.status(500).json({ error : error.message, message : "Failed to complete ride" });
    }
});



// Start Ride With Verify OTP -- Driver Side
router.put("/verifyOTP/:id", verifyDriver, async (req, res) => {
    const rideId = req.params.id; // ride id
    const otp = req.body.otp;
    
    try {    
        const ride = await MyRidesSchema.findById({ _id : rideId });

        if(!ride){
            return res.status(200).json({ status : 401, message : "Ride Not Found" });
        }

        // find passenger
        // const passenger = await UserSchema.findById({ _id : ride.userId });

        // compare otp
        // const otp1 = passenger.otp;
        // const otp2 = userOtp;
        
        // if(!otp1 === otp2){
        //     return res.status(200).json({ status : 401, message : "Incorrect OTP" });
        // };
        
        ride.start = true;      // ride start
        ride.inProgress = true; // ride in progress
        const rideStart = await ride.save();
        
        if(!rideStart){
            return res.status(200).json({ status : 401, message : "Fail to start ride" });
        };

        
        const rideResp = await MyRidesSchema.findById({ _id : rideStart._id }).populate("userId").populate("driverId");
         
        // Send Notification
        try {
            const resp = await SocketConfg.OTPVerified(rideStart.userId, { msg: "verified", rideId : rideResp._id });
            if (resp) {
                return res.status(200).json({ status: 200, message: "Notification has been sent to User", data: rideResp });
            } else {
                return res.status(401).json({ status: 401, message: "Failed to send Notification to User", data: rideResp });
            }
        } catch (error) {
            console.error("OTP VERIFICATION :: sending socket message:", error);
            return res.status(500).json({ error: "OTP VERIFICATION :: Failed to send socket message", message: error.message });
        }

    } catch (error) {
        res.status(500).json({ error : error.message, message : "Failed to verify otp" });
    }
});




// Get All rides
router.get("/passenger/:id/:usertype", verifyToken, async (req, res) => {
    const { id, usertype } = req.params;
    let Rides;

    try {
        if(usertype == "Driver"){
            Rides = await MyRidesSchema.find({ driverId : id });
        }else{
            Rides = await MyRidesSchema.find({ userId : id });
        }
        
        if(Rides.length < 1){
            return res.status(200).json({ status : 200, message : "Empty", data : Rides });
        };

        res.status(200).json({ status: 201, message: "Success", count : Rides.length, data: Rides });

    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to Get Ride" });
    }
});




module.exports = router;










// // Get All Rides By selectedType User or Driver
// router.get("/:selectedType", verifyToken, async (req, res) => {
//     const selectedType = req.params.selectedType;
//     try {
//         const Requests = await MyRidesSchema.find({selectedType}).populate("userId").populate("driverId");;
//         res.status(200).json({
//             status: 201,
//             message: "Success",
//             data: Requests
//         });

//     } catch (error) {
//         res.status(500).json({ error: "Failed to Get Rides", message: error.message });
//     }
// });



// const chosenDriver = await UserSchema.aggregate([
//     { $match: { selectedType: "Driver", active: true,inProgress: false}},
//     {$geoNear: {near: { type: "Point", coordinates: [passenger.longitude, passenger.latitude] },
//             distanceField: "distance", maxDistance: 5000, spherical: true }
//     },{ $sample: { size: 1 } }
// ]);



// const passangerLocation = { lat : passengerExist.latitude, lon : passengerExist.longitude };

// const drivers = await UserSchema.find({ selectedType : "Driver", active : true, inProgress : false });
    // if(drivers.length < 1){
    //     res.status(200).json({ message : "Driver not found" })
    // }
    // const nearbyDriver = drivers.filter(async (driver) => {
    //     const driverlocation = { lat : driver.latitude, lon : driver.longitude };
    //     const result = await Calculate.distance({ p1 : passanger, p2 : driverlocation });
    //     return result.distance < 5;  
    // })
    // // select ramdom driver
    // const max = nearbyDriver.length;
    // const chooseDriver = nearbyDriver[Math.floor(Math.random() * (max - 1) + 1)];
    // return chooseDriver; 


    // return res.status(200).json({ status: 201, message: "Success", data: rideRequest, driver : Driver[0] });