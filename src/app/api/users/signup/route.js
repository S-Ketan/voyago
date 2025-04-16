import { connectDB } from "@/dbConfig/dbConfig";
import { User } from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    // Validation

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send Email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    return NextResponse.json(
      {
        message:"User created successfully",
        success:true
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
