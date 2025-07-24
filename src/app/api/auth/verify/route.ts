import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();
        if (!email || !code) {
            return NextResponse.json({ message: "Email and code are required." }, { status: 400 });
        }
        await dbConnect();
        const user = await User.findOne({ email });
        if (!user || !user.verifyCode || !user.verifyCodeExpires) {
            return NextResponse.json({ message: "No verification code found." }, { status: 400 });
        }
        if (user.verifyCode !== code) {
            return NextResponse.json({ message: "Invalid code." }, { status: 400 });
        }
        if (user.verifyCodeExpires < new Date()) {
            return NextResponse.json({ message: "Code expired." }, { status: 400 });
        }
        user.verified = true;
        user.verifyCode = null;
        user.verifyCodeExpires = null;
        await user.save();
        return NextResponse.json({ message: "Email verified." }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
} 