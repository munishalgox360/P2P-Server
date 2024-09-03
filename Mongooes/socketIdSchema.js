const mongoose = require("mongoose");

const socketIds = new mongoose.Schema({
    userId : {
        type : String,
        trim : true,
        required : true
    },
    socketId : {
        type : String,
        trim : true,
        required : true
    }
},{ timestamps : true });


module.exports = mongoose.model("SocketId", socketIds);