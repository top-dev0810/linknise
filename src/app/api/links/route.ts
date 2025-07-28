import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { User } from "@/lib/user.model";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const destinationUrl = formData.get("destinationUrl") as string;
    const unlockActionsRaw = formData.get("unlockActions") as string;
    const coverFile = formData.get("cover") as File | null;

    if (!title || !description || !destinationUrl || !unlockActionsRaw) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    let unlockActions;
    try {
      unlockActions = JSON.parse(unlockActionsRaw);
    } catch {
      return NextResponse.json({ message: "Invalid unlock actions" }, { status: 400 });
    }

    if (!Array.isArray(unlockActions) || unlockActions.length === 0) {
      return NextResponse.json({ message: "At least one unlock action is required" }, { status: 400 });
    }

    let coverImage = "";
    if (coverFile) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save to temp file
      const tempPath = join(tmpdir(), `cover-${Date.now()}.${coverFile.name.split('.').pop()}`);
      await writeFile(tempPath, buffer);
      
      // Upload to Cloudinary
      const uploadResult = await cloudinary.v2.uploader.upload(tempPath, {
        folder: "linkunlocker/covers",
        resource_type: "image",
      });
      
      coverImage = uploadResult.secure_url;
    }

    const link = await Link.create({
      title,
      description,
      destinationUrl,
      unlockActions,
      coverImage,
      creator: user._id,
      views: 0,
      unlocks: 0,
    });

    return NextResponse.json({ 
      message: "Link created successfully",
      linkId: link._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 