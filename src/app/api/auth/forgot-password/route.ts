import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User, IUser } from "@/lib/user.model";
import { sendMail } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }
    await dbConnect();
    const user = (await User.findOne({ email })) as IUser | null;
    if (user && user.verified) {
      const resetCode = generateCode();
      const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      user.resetCode = resetCode;
      user.resetCodeExpires = resetCodeExpires;
      await user.save();
      await sendMail({
        to: email,
        subject: "Your Linknise Password Reset Code",
        html: `<div style='font-family:sans-serif;font-size:1.1rem'><p>Your password reset code is:</p><h2 style='color:#6c47ff;letter-spacing:2px;'>${resetCode}</h2><p>This code will expire in 10 minutes.</p></div>`,
        text: `Your password reset code is: ${resetCode}`,
      });
    }
    // Always return success for security
    return NextResponse.json({ message: "If your email is registered and verified, a reset code has been sent." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
} 