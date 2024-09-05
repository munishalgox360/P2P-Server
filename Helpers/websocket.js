const SocketIdSchema = require("../Mongooes/socketIdSchema.js");
var io;


let SocketConfg = {
    
    configSocketServer : function(socketio){
        io = socketio;
        io.on("connection", (socket) => {
            console.log("New connection established");
    
            socket.on("setUserIds", async (userId) => {
                const isExist = await SocketIdSchema.findOne({ userId : userId });

                if(!isExist){
                    const saveConnectionIds = await SocketIdSchema.create({
                        userId: userId,
                        socketId: socket.id
                    })

                if (saveConnectionIds){
                    console.log("Connection open for :: ", saveConnectionIds.userId);    
                } 

                }else{
                    const update = await SocketIdSchema.findOneAndUpdate({ userId: userId }, { socketId: socket.id });
                    if (update) console.log("Connection open for : ", update.userId);    
                }
            })
    
    
            socket.on("disconnect", async (userId) => {
                const deleteConnectionIds = await SocketIdSchema.findOneAndDelete({ userId: userId });
                if (deleteConnectionIds) console.log("Connection closed for : ", deleteConnectionIds.userId);
            })
        });
    },

    SendMessage : async function(userId, event, message){
        try {
            const user = await SocketIdSchema.findOne({ userId : userId });
           
            if (!user) {
                console.log("Not found : ", userId);
                return false;
            }

            if (!user.socketId) {
                console.log("Socket ID not found : ", user);
                return false;
            }

            io.to(user.socketId).emit(event, message);
            return true;
            
        } catch (error) {
           console.log("Socket Message :: failed to send message", error.stack);     
        }
    },

    AcceptRideMessage : async function(userId, message){
        try {
            const user = await SocketIdSchema.findOne({ userId : userId });
           
            if (!user) {
                console.log("User not found : ", user);
                return false;
            }

            if (!user.socketId) {
                console.log("Socket ID not found for driver:", user);
                return false;
            }

            io.to(user.socketId).emit("accepted", message);
            return true;
        } catch (error) {
            console.log("Socket Message :: failed to send message", error.stack);     
        }
    },

    StartRide : async function(userId, message){
        try {
            const user = await SocketIdSchema.findOne({ userId : userId });
           
            if (!user) {
                console.log("User not found : ", user);
                return false;
            }

            if (!user.socketId) {
                console.log("Socket ID not found for driver:", user);
                return false;
            }

            io.to(user.socketId).emit("startride", message);
            return true;
        } catch (error) {
            console.log("Socket Message :: failed to send message", error.stack);     
        }
    },

    CandelRide : async function(userId, message){
        try {
            const user = await SocketIdSchema.findOne({ userId : userId });
           
            if (!user) {
                console.log("User not found : ", user);
                return false;
            }

            if (!user.socketId) {
                console.log("Socket ID not found for driver:", user);
                return false;
            }

            io.to(user.socketId).emit("cancelride", message);
            return true;
        } catch (error) {
            console.log("Socket Message :: failed to send message", error.stack);     
        }
    },

    OTPVerified : async function(userId, message){
        try {
            const user = await SocketIdSchema.findOne({ userId : userId });
           
            if (!user) {
                console.log("User not found : ", user);
                return false;
            }

            if (!user.socketId) {
                console.log("Socket ID not found for driver:", user);
                return false;
            }

            io.to(user.socketId).emit("otpverified", message);
            return true;
        } catch (error) {
            console.log("Socket Message :: failed to send message", error.stack);     
        }
    }
};

module.exports = SocketConfg;




