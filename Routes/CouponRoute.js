const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middlewares/auth.js");
const { generateCouponCode } = require("../Helpers/OTP-Token.js");
const CouponSchema = require("../Mongooes/CouponSchema.js");



// Create Festival Coupon
router.post("/create", verifyToken, async (req, res) => {
  try {
    const  { title, discount, purpose } = req.body;

    const isExist = await CouponSchema.findOne({ title });
    if(isExist){
        return res.status(200).json({ status : 401, message : "Already Exist" });
    };    


    const coupon = generateCouponCode();

    const newCoupon = new CouponSchema({
      title, coupon, discount, purpose    
    });

    const createResp = await newCoupon.save();

    res.status(200).json({ status: 201, message: "Success", data: createResp });

  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to create coupon(31)" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  const purpose = req.query.purpose;
  try {
    const CouponData = await CouponSchema.find({ purpose : purpose });

    if(CouponData) res.status(200).json({ stauts: 201, message: "Success", data: CouponData });

  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to get coupon(46)" });
  }
});

router.put("/update", verifyToken, async (req, res) => {
  try {
    const { couponId, discount, active } = req.body;

    const updatedCoupon = await CouponSchema.findByIdAndUpdate(
      { _id : couponId },
      { active, discount },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(200).json({ status: 401,  message: "Not Update" });
    }

    res.status(200).json({ status: 201,  message: "Success", data: updatedCoupon });
  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to update coupon(68)" });
  }
});

router.delete("/delete/:couponId", verifyToken, async (req, res) => {
  try {
    const { couponId } = req.params;

    const deletedCoupon = await CouponSchema.findByIdAndDelete({ _id: couponId });

    if (!deletedCoupon) {
      return res.status(200).json({ status: 201, message: "Not Deleted" });
    } 

    res.status(200).json({ status: 201, message: "Success", data: deletedCoupon });
  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to delete coupon(87)" });
  }
});


// Assign  
router.put("/assign", verifyToken, async (req, res) => {
  try {
    const { couponId, userId } = req.body;

    let date = new Date();
    let expireOn = date.setDate(date.getDate()+2);

    const festivalCoupon = await CouponSchema.create({
      userId, couponId, expireOn 
    });


    res.status(200).json({
      status: 201,
      message: "Success",
      data: festivalCoupon 
    });

  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to assign coupon" });
  }
});



// Assign Coupon after 5 rides
router.get("/regularCoupon/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    let date = new Date();
    let expireOn = date.setDate(date.getDate()+2);

    const coupon = generateCouponCode();

    const newCoupon = new CouponSchema({
      title : "5-Rides", coupon, discount : 5, purpose : "regular"
    });

    const createResp = await newCoupon.save();
    if(!createResp){
      return res.status(200).json({ status : 401, message : "Failed to create (5 Rides) coupon" });
    };

    const assignCoupon = await CouponSchema.create({
      userId,
      couponId : createResp._id,
      expireOn 
    });


    if(!assignCoupon){
      return res.status(200).json({ status : 401, message : "Failed to assign coupon" });
    };

    const getcoupon = await CouponSchema.findById({ _id : assignCoupon._id }).populate("couponId");

    res.status(200).json({
      status: 201,
      message: "Success",
      data: getcoupon 
    });

  } catch (error) {
    res.status(500).json({ error: error.message,  message : "Failed to assign coupon" });
  }
});



module.exports = router;



// Expired or Not

// const date = new Date();
// const createdAt = new Date();
// const expireOn = new Date();

// createdAt.setDate(date.getDate()+2);
// expireOn.setDate(date.getDate()+2);

// console.log(createdAt, "----", expireOn)
// const res = (createdAt >= expireOn) ? "Expired" : "Active";
// console.log(res)



























 // New Coupon
    // const newCoupon = new CouponSchema({
    //   coupon,
    //   discount,
    //   active: true,
    // });
    // const savedCoupon = await newCoupon.save();
   

    // if (user) {
    //   user.coupons.push({
    //     couponId: savedCoupon._id,
    //     coupon: savedCoupon.coupon,
    //     discount: savedCoupon.discount,
    //   });
    //   await user.save();
    // }
     

    // const assignCoupon = await UserCouponSchema({
    //   userId,
    //   couponId: savedCoupon._id,
    //   coupon: savedCoupon.coupon,
    //   discount: savedCoupon.discount,
    // });

    // await assignCoupon.save();
