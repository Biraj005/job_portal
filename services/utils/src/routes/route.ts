import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;

    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
    const cloude = await cloudinary.v2.uploader.upload(buffer);

    res.json({
      url: cloude.secure_url,
      public_id: cloude.public_id,
    });
  } catch (error: any) {
    res.status(500).json({ error: `Image upload failed ${error.message}` });
  }
});

export default router;
