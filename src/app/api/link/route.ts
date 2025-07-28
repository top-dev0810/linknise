import { NextRequest, NextResponse } from "next/server";
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