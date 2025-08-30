const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Nodemailer",
      text: "This is a test email to verify your Nodemailer setup.",
    });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}

testEmail();
