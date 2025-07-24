import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodbPromise";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import bcrypt from "bcryptjs";
import type { Session, User as NextAuthUser, JWT, SessionStrategy } from "next-auth";

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
        if (!user || !(user as any).password) return null;
        const valid = await bcrypt.compare(credentials.password, (user as any).password);
        if (!valid) return null;
        if (!user.verified) {
          // @ts-ignore
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
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        (session.user as any).id = dbUser?._id;
        session.user.name = dbUser?.name;
        session.user.image = dbUser?.image;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        (token as any).id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 