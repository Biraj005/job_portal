import multer from 'multer';

// Store file in memory (buffer available at req.file.buffer)
const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
}).single('file');
