// Firebase
const firebase = require("./firebase.js");

async function pushNotification(data) {
   try {
    const resp = await firebase.messaging().send({
        token: data.fmc_token,
        notification: { title: data.title, body: data.body }
    });

    if(resp?.success == 1){
        console.log("notification send successfully");
    }
   } catch (error) {
    console.log("fcm_message", error);
   }
};





//------------------------ Twilio ---------------------------------//



// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const Notify = require('twilio')(accountSid, authToken);



// Notification Services
function NotifyService(servicename, template) {
    if (servicename == "message") {
        return message(template);
    } else if (servicename == "email") {
        email(template);
    }
};



async function message(body) {
    // const messageResp = await Notify.messages.create({
    //     from: '+15017122661',    
    //     to: '+15558675310',
    //     body: body,
    // });
    // return (messageResp) ? true : false;

//     console.log(body);
//     return true;
};

module.exports = { NotifyService, pushNotification };

































