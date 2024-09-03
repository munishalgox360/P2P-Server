require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const { createServer } = require('node:https');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors("*"));

app.use(express.static(path.join(__dirname, "Public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//-------------------- Routes ------------------
const UserRoute = require("./Routes/UserRoute.js");
const Coupon = require("./Routes/CouponRoute.js");
const Payment = require("./Routes/PaymentRoute.js");
const VehicleSegment = require("./Routes/VehicleSegmentRoute.js");
const MyRides = require("./Routes/MyRidesRoute.js");
const Logs = require("./Routes/logRoute.js");
//-------------------- End ------------------------


// Database Connection
const mongoDBConnect = async() => {
  try{
    await mongoose.connect(process.env.MONGO_LIVE_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
    });
    console.log("DATABASE CONNECTED...");
  }
  catch(error){
    console.log("DATABASE NOT CONNECTED !! ",error)
  }
};
mongoDBConnect();



app.get("/test",function(req, res){
  res.send("<h1 style='color:#E0E008; font-size:100px'> Hi! Welcome to P2P Server </h1>");
});


app.get("/socket",(req,res) => {
  res.render("index")
});

// --------------Index APIs------------------
app.use("/User", UserRoute); 
app.use("/Coupon", Coupon); 
app.use("/Payment", Payment); 
app.use("/Segment", VehicleSegment); 
app.use("/MyRides", MyRides);
app.use("/log", Logs);
// ------------------End---------------------


// WebSocket
const privateKey = fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const server = createServer(app);
var io = new Server(server, { cors : { origin : "*", methods : ["GET", "PUT", "POST", "DELETE"], credentials : true }});


const SocketConfg = require("./Helpers/websocket.js");
SocketConfg.configSocketServer(io);


server.listen(port, (req, res) => {
  console.log("Server listening on port : " + port);
})
