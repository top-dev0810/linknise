import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    name?: string;
    username?: string; // Added for public profile URLs
    image?: string;
    password?: string;
    verified?: boolean;
    verifyCode?: string | null;
    verifyCodeExpires?: Date | null;
    resetCode?: string | null;
    resetCodeExpires?: Date | null;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        username: { type: String, unique: true, sparse: true }, // Added for public profile URLs
        image: { type: String },
        password: { type: String, required: false, select: false }, // required for credentials, not for OAuth
        verified: { type: Boolean, default: false },
        verifyCode: { type: String, default: null },
        verifyCodeExpires: { type: Date, default: null },
        resetCode: { type: String, default: null },
        resetCodeExpires: { type: Date, default: null },
        bio: { type: String, default: "" },
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema); 