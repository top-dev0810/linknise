import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodbPromise";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import bcrypt from "bcryptjs";
import type { Session, User as NextAuthUser, SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";

function isUserWithPassword(user: unknown): user is { password: string; verified: boolean; _id: string; email: string; name?: string; image?: string } {
    return (
        typeof user === "object" &&
        user !== null &&
        "password" in user &&
        typeof (user as { password?: unknown }).password === "string" &&
        "verified" in user &&
        typeof (user as { verified?: unknown }).verified === "boolean"
    );
}

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials) return null;
                await dbConnect();
                const user = await User.findOne({ email: credentials.email }).select("+password verified");
                if (!isUserWithPassword(user)) return null;
                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;
                if (!user.verified) {
                    throw new Error("Please verify your email before signing in.");
                }
                return { id: String(user._id), email: user.email, name: user.name, image: user.image } as NextAuthUser;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    callbacks: {
        async session({ session }: { session: Session }) {
            if (session?.user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser && session.user) {
                    (session.user as { id?: string }).id = dbUser._id?.toString();
                    session.user.name = dbUser.name;
                    session.user.image = dbUser.image;
                }
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
            if (user && "id" in user) {
                (token as { id?: string }).id = (user as { id?: string }).id;
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
}; 