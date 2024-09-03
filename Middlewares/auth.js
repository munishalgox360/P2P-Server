const DriverSchema = require("../Mongooes/DriverSchema.js");
const jwt = require("jsonwebtoken");
const UserSchema = require("../Mongooes/UserSchema.js");


const accessToken = async (user, res) => {
    try {
        
        const payload = {
            id : user._id,
            email : user.email,
            name : user.name
        };

        const option = {
            issuer : "P2P",
            expiresIn : "1y"
        };

        const secret_key = process.env.P2P_SECRET;
        const token = jwt.sign(payload,secret_key,option);
        if(token) return token;

    } catch (error) {
        res.status(500).json({ error : "Failed to create session" , message : error.message });
    }
};


const verifyToken = async (req, res, next) => {
    try {
         
        const header = req.headers.authorization;
        if(!header) return res.status(200).json({ status : 401, message : "Token is required" });

        const headerToken = header.split(" ");
        
        if(headerToken[0] !== "bearer" || typeof headerToken[1] !== "string"){
            return res.status(200).json({ status : 401, message : "Incorrect Token" });
        }

        const token = headerToken[1];
        const secret_key = process.env.P2P_SECRET;
        
        //verify
        const verify = jwt.verify(token,secret_key);

        const user = await UserSchema.findById({ _id : verify.id });
        req.userid = user._id;   
        next();
    } catch (error) {
        res.status(500).json({ error : "Session Expired, Please Login", message : error.message });
    }
};


const verifyDriver = async (req, res, next) => {
    try {
         
        const header = req.headers.authorization;
        if(!header) return res.status(200).json({ status : 401, message : "Token is required" });

        const headerToken = header.split(" ");
        
        if(headerToken[0] !== "bearer" || typeof headerToken[1] !== "string"){
            return res.status(200).json({ status : 401, message : "Incorrect Token" });
        }

        const token = headerToken[1];
        const secret_key = process.env.P2P_SECRET;
        
        //verify
        const verify = jwt.verify(token,secret_key);

        //check Account is verify or not
        const user = await DriverSchema.findById({ _id : verify.id });
        if(!user.verify) return res.status(200).json({ status : 401, message : "Your Account will be verified within 24 Hours, otherwise contact with customer care" });

        req.userid = user._id;
        next();

    } catch (error) {
        res.status(500).json({ error : "Session Expired, Please Login", message : error.message });
    }
};


module.exports = { accessToken, verifyToken, verifyDriver };