import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    await dbConnect();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already in use." }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const verifyCode = generateCode();
    const verifyCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Generate username from name
    let baseUsername = name.replace(/\s+/g, "").toLowerCase();
    baseUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, "");
    if (!/^[a-zA-Z]/.test(baseUsername)) {
      baseUsername = "user" + baseUsername;
    }

    // Check if username exists and add number if needed
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    await User.create({
      name,
      email,
      username,
      password: hashed,
      verified: false,
      verifyCode,
      verifyCodeExpires,
    });
    // Send email with code
    await sendMail({
      to: email,
      subject: "Your Linknise Verification Code",
      html: `<div style='font-family:sans-serif;font-size:1.1rem'><p>Your verification code is:</p><h2 style='color:#6c47ff;letter-spacing:2px;'>${verifyCode}</h2><p>This code will expire in 10 minutes.</p></div>`,
      text: `Your verification code is: ${verifyCode}`,
    });
    return NextResponse.json({ message: "User created. Verification required." }, { status: 201 });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
} 