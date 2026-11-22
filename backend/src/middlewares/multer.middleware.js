import multer from "multer";
import os from "os";
import fs from "fs";

// In serverless environments (like Vercel), local filesystem is read-only except os.tmpdir() (/tmp)
const tempDir = process.env.VERCEL ? os.tmpdir() : "./public/temp";

if (!process.env.VERCEL) {
  try {
    fs.mkdirSync(tempDir, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

export const upload = multer({ storage: storage });
