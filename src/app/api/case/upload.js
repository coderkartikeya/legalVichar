import nextConnect from 'next-connect';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage so multer doesn't write to disk
const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const bufferToStream = (buffer) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
  };

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'legalvichar_uploads',
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      bufferToStream(req.file.buffer).pipe(stream);
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ error: 'Cloud upload failed' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
