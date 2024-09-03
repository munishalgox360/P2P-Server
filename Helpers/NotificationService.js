// Configuration
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

    console.log(body);
    return true;
};




function email(body) {
    
};



function pushNotification(body){

};





// Export Services
module.exports = NotifyService;






