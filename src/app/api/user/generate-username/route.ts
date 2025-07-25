import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // If user already has a username, return it
        if (user.username) {
            return NextResponse.json({ username: user.username });
        }

        // Generate username from name or email
        let baseUsername = "";
        if (user.name) {
            baseUsername = user.name.replace(/\s+/g, "").toLowerCase();
        } else {
            baseUsername = user.email.split("@")[0];
        }

        // Remove special characters and ensure it starts with a letter
        baseUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, "");
        if (!/^[a-zA-Z]/.test(baseUsername)) {
            baseUsername = "user" + baseUsername;
        }

        // Check if username exists and add number if needed
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }

        // Save username to user
        user.username = username;
        await user.save();

        return NextResponse.json({ username });
    } catch (error) {
        console.error("Error generating username:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 