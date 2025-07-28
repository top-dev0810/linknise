import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { User } from "@/lib/user.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const links = await Link.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      links: links.map(link => ({
        ...link,
        _id: link._id?.toString(),
        creator: link.creator?.toString(),
      }))
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 