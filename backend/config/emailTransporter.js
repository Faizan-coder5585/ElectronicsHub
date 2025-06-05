const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service here, Gmail for example
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password (or app password if using 2FA)
  },
});

// Export the transporter for use in routes
module.exports = transporter;
