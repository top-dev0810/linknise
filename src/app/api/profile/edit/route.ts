import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
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
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json({ message: "Name and username are required" }, { status: 400 });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ message: "Username can only contain letters, numbers, and underscores" }, { status: 400 });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
    if (existingUser) {
      return NextResponse.json({ message: "Username is already taken" }, { status: 400 });
    }

    let imageUrl = user.image || "";

    // Handle image upload
    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to temp file
        const tempPath = join(tmpdir(), `profile-${Date.now()}.${imageFile.name.split('.').pop()}`);
        await writeFile(tempPath, buffer);

        // Upload to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(tempPath, {
          folder: "linkunlocker/profiles",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" }
          ]
        });

        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        username,
        bio,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
      image: imageUrl,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 