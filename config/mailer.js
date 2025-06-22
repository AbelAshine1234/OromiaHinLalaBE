const nodemailer = require('nodemailer');
require('dotenv').config();

// Debugging: Log environment variables to check if they are loaded
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS loaded:', process.env.EMAIL_PASS ? 'Yes' : 'No');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendQrCodeEmail = async (to, qrCodeBuffer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Checkout QR Code',
    html: `
      <h1>Checkout Successful!</h1>
      <p>Thank you for checking out with Oromia Hinlala.</p>
      <p>Please find your QR code attached to this email. You can use it to verify your checkout.</p>
      <p><b>Note:</b> This QR code is unique to your checkout and should be kept confidential.</p>
    `,
    attachments: [
      {
        filename: 'qr-code.png',
        content: qrCodeBuffer,
        contentType: 'image/png',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('QR code email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending QR code email:', error);
    // Depending on your application's needs, you might want to handle this error more gracefully
  }
};

module.exports = { sendQrCodeEmail }; 