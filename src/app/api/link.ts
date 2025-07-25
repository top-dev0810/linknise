import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Link } from "@/lib/link.model";
import { User } from "@/lib/user.model";

export async function GET(req: NextRequest) {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Link ID is required" }), { status: 400 });
    const link = await Link.findById(id).lean();
    if (!link) return new Response(JSON.stringify({ error: "Link not found" }), { status: 404 });
    const creator = await User.findById(link.creator).lean();
    const creatorLinksCount = await Link.countDocuments({ creator: link.creator });
    return new Response(JSON.stringify({ link, creator, creatorLinksCount }), { status: 200 });
} 