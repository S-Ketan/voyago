import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async (email, emailType, userId) => {
  try {
    //Configure mail for users
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "db212b07ab1b26",
        pass: "****9237",
      },
    });

    const mailOptions = {
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verification Link" : "Password reset Link", // Subject line
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to 
        ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        or copy and paste the tink below in your browser.
        <br />
        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>`,
    };
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error("Error sending email: " + error.message);
  }
};
