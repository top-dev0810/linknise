import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Type definitions for better type safety
interface SessionUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

interface CloudinaryResult {
  secure_url: string;
  public_id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const link = await Link.findOne({
      _id: id,
      creator: (session.user as SessionUser).id,
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const link = await Link.findOne({
      _id: id,
      creator: (session.user as SessionUser).id,
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const destinationUrl = formData.get("destinationUrl") as string;
    const unlockActions = JSON.parse(formData.get("unlockActions") as string);
    const coverImageFile = formData.get("coverImage") as File | null;

    // Validate required fields
    if (!title || !description || !destinationUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Handle cover image upload if provided
    let coverImageUrl = link.coverImage;
    if (coverImageFile && coverImageFile.size > 0) {
      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "linkunlocker/covers",
            transformation: [
              { width: 800, height: 450, crop: "fill" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResult);
          }
        ).end(buffer);
      });

      coverImageUrl = result.secure_url;
    }

    // Update link
    link.title = title;
    link.description = description;
    link.destinationUrl = destinationUrl;
    link.unlockActions = unlockActions;
    if (coverImageUrl) {
      link.coverImage = coverImageUrl;
    }

    await link.save();

    return NextResponse.json({ message: "Link updated successfully", link });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const link = await Link.findOneAndDelete({
      _id: id,
      creator: (session.user as SessionUser).id,
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
} 