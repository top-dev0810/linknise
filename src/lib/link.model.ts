import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILink extends Document {
    url: string;
    title: string;
    description?: string;
    unlockType: "click" | "visit" | "form";
    creator: Types.ObjectId;
    unlockedBy: Types.ObjectId[];
}

const LinkSchema: Schema<ILink> = new Schema(
    {
        url: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        unlockType: { type: String, enum: ["click", "visit", "form"], default: "click" },
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        unlockedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export const Link: Model<ILink> =
    mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema); 