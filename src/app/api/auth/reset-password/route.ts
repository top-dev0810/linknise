import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpires) {
      return NextResponse.json({ message: "No reset code found." }, { status: 400 });
    }
    if (user.resetCode !== code) {
      return NextResponse.json({ message: "Invalid code." }, { status: 400 });
    }
    if (user.resetCodeExpires < new Date()) {
      return NextResponse.json({ message: "Code expired." }, { status: 400 });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();
    return NextResponse.json({ message: "Password reset successful." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
} 