import app from "./app.js";
import dotenv from 'dotenv';
import { connectRabbitMQ } from "./utils/queue-config.js";
dotenv.config();

async function bootstrap() {
  await connectRabbitMQ();

  const PORT = process.env.PORT || 3004;
  app.listen(PORT, () => console.log(`🚀 Job service running on port ${PORT}`));
}

bootstrap();
