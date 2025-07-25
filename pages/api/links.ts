import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/mongodb';
import { Link } from '@/lib/link.model';
import { User } from '@/lib/user.model';
import cloudinary from 'cloudinary';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: 'Form parse error' });
        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
        const unlockActionsRaw = Array.isArray(fields.unlockActions) ? fields.unlockActions[0] : fields.unlockActions;
        let unlockActions = [];
        try {
            unlockActions = JSON.parse(unlockActionsRaw || '[]');
        } catch {
            return res.status(400).json({ message: 'Invalid unlock actions.' });
        }
        if (!title || !description || !Array.isArray(unlockActions) || unlockActions.length === 0) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        let coverImage = '';
        const coverFile = files.cover && Array.isArray(files.cover) ? files.cover[0] : files.cover;
        if (coverFile && (coverFile as File).filepath) {
            const upload = await cloudinary.v2.uploader.upload((coverFile as File).filepath, {
                folder: 'linkunlocker/covers',
                resource_type: 'image',
            });
            coverImage = upload.secure_url;
            fs.unlinkSync((coverFile as File).filepath);
        }
        await dbConnect();
        const user = await User.findOne({ email: session.user!.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const link = await Link.create({
            title,
            description,
            unlockActions,
            coverImage,
            creator: user._id,
        });
        return res.status(201).json({ message: 'Link created.', linkId: link._id });
    });
} 