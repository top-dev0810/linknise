import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { User } from "@/lib/user.model";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    const link = await Link.findById(id).lean();
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const creator = await User.findById(link.creator).lean();
    const creatorLinksCount = await Link.countDocuments({ creator: link.creator });

    return NextResponse.json({
      link: {
        ...link,
        _id: link._id?.toString(),
        creator: link.creator?.toString(),
      },
      creator: {
        ...creator,
        _id: creator?._id?.toString(),
      },
      creatorLinksCount
    });
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { linkId, actionIndex, completed } = body;

    if (!linkId || actionIndex === undefined || completed === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const link = await Link.findById(linkId);
    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // Handle different types of tracking
    if (actionIndex === -2) {
      // View tracking
      await Link.findByIdAndUpdate(linkId, { $inc: { views: 1 } });
    } else if (completed) {
      // Final unlock tracking
      await Link.findByIdAndUpdate(linkId, { $inc: { unlocks: 1 } });
    }
    // Individual action completions could be tracked here if needed

    return NextResponse.json({
      message: "Action tracked successfully",
      completed
    });

  } catch (error) {
    console.error("Error tracking unlock action:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 