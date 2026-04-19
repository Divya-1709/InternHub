const nodemailer = require("nodemailer");

let cachedTransporter = null;

const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    jsonTransport: true
  });

  return cachedTransporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@internhub.local",
    to,
    subject,
    html
  });

  return {
    info,
    simulated: !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD
  };
};

module.exports = {
  sendEmail
};
