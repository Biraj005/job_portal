import express from "express";
import dotenv from "dotenv";
import utilsRouter from "./routes/route.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { startNotificationService } from "./queu-config.js";

dotenv.config();
startNotificationService();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/utils", utilsRouter);

app.listen(PORT, async () => {
  console.log(`Util Server is running on port ${PORT}`);
  console.log("Connected to RabbitMQ");
});
