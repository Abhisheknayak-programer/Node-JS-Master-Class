const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transpoter
  //   const transpoter = nodemailer.createTransport({
  //     service: "Gmail",
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //     // Activate in your gmail "less secure app" option
  //   });

  const transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // secure: false,
    // logger: true,
  });

  // 2. Define the email options
  const mailOptions = {
    from: "Abhishek Nayak <abhishek@nayak.in>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html : [you can also send HTML]
  };

  // 3. Actually send the email
  await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
