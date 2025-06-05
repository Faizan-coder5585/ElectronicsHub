const nodemailer = require('nodemailer');

/**
 * Sends an email to a specific recipient.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text body of the email.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'gmail' or another email service provider
      auth: {
        user: process.env.EMAIL_USER, // Email address from .env
        pass: process.env.EMAIL_PASS, // Email password or app password from .env
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to,                           // Recipient address
      subject,                      // Email subject
      text,                         // Plain text content
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw new Error('Failed to send email.');
  }
};

module.exports = sendEmail;
