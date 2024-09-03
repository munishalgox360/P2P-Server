const express = require("express");
const fs = require("fs");
const { verifyToken } = require("../Middlewares/auth.js");
const VehicleSegmentSchema = require("../Mongooes/VehicleSegmentSchema.js");
const upload = require("../Helpers/Upload.js");
const router = express.Router();



// Create Vehicle Segment
router.post("/",  verifyToken, upload.single('file'), async (req, res) => {
    const { vehSegment, pricePer_km, basePrice, capacity }  = req.body;

    try {
        const isExist = await VehicleSegmentSchema.findOne({ vehSegment });

        if(isExist){
            return res.status(200).json({ status : 401, message : "Already Exist" });
        }

        const newSegment = new VehicleSegmentSchema({
            vehSegment, 
            pricePer_km,
            basePrice, 
            capacity,
            image : req.file?.originalname
        });

        const createResponse = await newSegment.save();

        if(!createResponse){
            return res.status(200).json({ status : 401, message : "Not Created", data : createResponse });
        };

        res.status(200).json({ status: 201, message: "Success", data : createResponse });            
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to create(36)" });
    }
});


// Get Vehicle Segment
router.get("/", async (req, res) => {
    const deleted = req.query.deleted;
    
    try {
        const getSegment = await VehicleSegmentSchema.find({ deleted : deleted });

        if(getSegment.length < 1){
            return res.status(200).json({ stauts: 401, message: "Empty", data: getSegment });
        };

        res.status(200).json({ stauts: 201, message: "Success", count: getSegment.length, data: getSegment });
    }catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to Get(54)" });
    }
});


// Update Vehicle Price/km
router.put("/", verifyToken, upload.single('file'), async (req, res) => {
    const { id, pricePer_km, basePrice } = req.body;
    let fieldToUpdate;

    try {
        const segment = await VehicleSegmentSchema.findById({ _id : id });
        if(!segment){
            return res.status(200).json({ status : 401, message : "Segment Not Found" });
        }
       

        if(req.file?.filename){
            fieldToUpdate = { 
                pricePer_km : pricePer_km,
                basePrice : basePrice,
                image : req.file?.originalname
            }
            fs.unlinkSync(`Public/file${segment.image}`);
        }else{
            fieldToUpdate = {
                pricePer_km : pricePer_km,
                basePrice : basePrice
            }
        }

        const updateResponse = await VehicleSegmentSchema.findByIdAndUpdate({ _id : id }, fieldToUpdate, { new : true });

        if(!updateResponse){
            return res.status(200).json({ stauts: 401, message: "Not Updated" });
        };

        res.status(200).json({ stauts: 201, message: "Success", data: updateResponse });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Failed to update(91)" });
    }
});


// Delete Vehicle Segment
router.delete("/", verifyToken, async (req, res) => {
    const { id, deleted } = req.body;

    try {
        const fieldToDelete = {
            deleted : deleted
        };

        const deleteResponse = await VehicleSegmentSchema.findByIdAndUpdate({ _id : id },  fieldToDelete , { new : true });

        if(!deleteResponse){
            return res.status(200).json({ stauts: 401, message: "Not Deleted" });
        };

        res.status(200).json({ stauts: 201, message: "Success", data: deleteResponse });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete", message : error.message });
    }
});


module.exports = router;