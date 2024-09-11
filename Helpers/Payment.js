const Razorpay = require("razorpay");


const Rzpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// QR Code & Customer
async function NewQrCode(details) {
  try {
    const customerExists = await Rzpay.customers.fetch(details.rzpay_custId);
    if(customerExists) {
      console.log("Customer Already Exists"); return;
    }

    const customer = await Rzpay.customers.create({
      name: details.firstName, email: details.email,
      fail_existing: 0
    });
  

    const qrcode = await Rzpay.qrCode.create({
      type: "upi_qr", name: customer.name, usage: "multiple_use",
      fixed_amount: false, customer_id: customer.id
    });

    return { customer, qrcode };
    
  } catch (error) {
    console.log( "QrCode and Customer" ,error);
  }
}


module.exports = { NewQrCode, Rzpay };