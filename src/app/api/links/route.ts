import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { User } from "@/lib/user.model";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title, description, url } = await req.json();
    if (!title || !description || !url) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const link = await Link.create({
        title,
        description,
        url,
        creator: user._id,
        unlockType: "visit", // default for now
        unlockedBy: [],
    });
    return NextResponse.json({ message: "Link created.", linkId: link._id }, { status: 201 });
} 