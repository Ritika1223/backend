const twilio = require('twilio');

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MSG_SERVICE_SID;


const client = twilio(accountSid, authToken);

async function sendOtp(phone, otp) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      messagingServiceSid: messagingServiceSid,
      to: formattedPhone,
    });

    console.log(`OTP sent to ${formattedPhone}: ${otp} | SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    return false;
  }
}

module.exports = sendOtp;
