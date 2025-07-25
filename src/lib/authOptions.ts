import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodbPromise";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import bcrypt from "bcryptjs";
import type { Session, User as NextAuthUser, SessionStrategy, Account } from "next-auth";
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
                // Explicitly select all needed fields
                const user = await User.findOne({ email: credentials.email }).select("+password verified email name image");
                console.log("Authorize user:", user);
                if (!isUserWithPassword(user)) return null;
                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;
                if (!user.verified) {
                    throw new Error("Please verify your email before signing in.");
                }
                // Make sure email is present
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
        async signIn({ user, account }: { user: NextAuthUser; account: Account | null }) {
            if (account?.provider === "google") {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser && !dbUser.username) {
                    // Generate username for Google users
                    let baseUsername = "";
                    if (dbUser.name) {
                        baseUsername = dbUser.name.replace(/\s+/g, "").toLowerCase();
                    } else {
                        baseUsername = user.email?.split("@")[0] || "user";
                    }

                    baseUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, "");
                    if (!/^[a-zA-Z]/.test(baseUsername)) {
                        baseUsername = "user" + baseUsername;
                    }

                    let username = baseUsername;
                    let counter = 1;
                    while (await User.findOne({ username })) {
                        username = `${baseUsername}${counter}`;
                        counter++;
                    }

                    dbUser.username = username;
                    await dbUser.save();
                }
            }
            return true;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session?.user) {
                // Always set email from token
                session.user.email = token.email as string;
                await dbConnect();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser && session.user) {
                    (session.user as { id?: string }).id = dbUser._id?.toString();
                    session.user.name = dbUser.name;
                    session.user.image = dbUser.image;
                    (session.user as { username?: string }).username = dbUser.username;
                }
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
            if (user) {
                console.log(user);

                (token as { id?: string }).id = (user as { id?: string }).id;
                token.email = user.email;
            }
            // If token already has email, keep it
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
}; 