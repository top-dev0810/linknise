import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import { Link } from "@/lib/link.model";

export async function GET(req: NextRequest) {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username");
    if (!username) return new Response(JSON.stringify({ error: "Username is required" }), { status: 400 });
    const user = await User.findOne({ username });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    const links = await Link.find({ creator: user._id }).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ user, links }), { status: 200 });
} 