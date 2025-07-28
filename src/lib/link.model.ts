import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUnlockAction {
    platform: string; // e.g., 'YouTube', 'Roblox', 'Other'
    type: string; // e.g., 'visit', 'subscribe', 'follow', etc.
    label: string; // e.g., 'Follow user', 'Subscribe to channel'
    url: string;
    validationType?: string; // e.g., 'click', 'visit', 'api', etc.
}

export interface ILink extends Document {
    destinationUrl: string;
    title: string;
    description?: string;
    coverImage?: string;
    unlockActions: IUnlockAction[];
    creator: Types.ObjectId;
    unlockedBy: Types.ObjectId[];
    views?: number;
    unlocks?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const UnlockActionSchema: Schema = new Schema(
    {
        platform: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
        url: { type: String, required: true },
        validationType: { type: String },
    },
    { _id: false }
);

const LinkSchema: Schema<ILink> = new Schema(
    {
        destinationUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        coverImage: { type: String },
        unlockActions: { type: [UnlockActionSchema], required: true },
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        unlockedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        views: { type: Number, default: 0 },
        unlocks: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Link: Model<ILink> =
    mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema); 