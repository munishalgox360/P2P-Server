const Razorpay = require("razorpay");


const Rzpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// QR Code & Customer
async function NewQrCode(details) {

  const customer = await Rzpay.customers.create({
    name: details.name,
    email: details.email,
    mobile: details.mobile,
    fail_existing: 0
  });

  const qrcode = await Rzpay.qrCode.create({
    type: "upi_qr",
    name: customer.name,
    payment_amount: 2000,
    customer_id: customer.id,
    fail_existing: 0
  });

  return { customer, qrcode };
}


module.exports = { NewQrCode, Rzpay };