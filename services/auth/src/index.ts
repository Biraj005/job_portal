import app from "./app.js";
import dotenv from "dotenv";
import { connectToRabbitMQ } from "./utils/queue-config.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Auth service is running on port ${PORT}`);
  await connectToRabbitMQ();
  console.log("Connected to RabbitMQ");
});
