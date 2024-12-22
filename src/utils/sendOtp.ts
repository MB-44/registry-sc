import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "your_twilio_sid";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your_twilio_auth_token";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "your_twilio_phone_number";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendOtp = async (phoneNumber: string, otp: string) => {
  await client.messages.create({
    body: `Your OTP code is ${otp}`,
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};
