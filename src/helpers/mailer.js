import nodemailer from "nodemailer";

export const sendEmail = async (email, emailType, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOptions = {
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: email, // list of receivers
      subject:
        emailType === "Verify" ? "Verification Link" : "Password reset Link", // Subject line
      html: "<b>Hello world?</b>", // html body
    };
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error("Error sending email: " + error.message);
  }
};
