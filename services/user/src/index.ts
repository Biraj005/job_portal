import app from "./app.js";
import { startUtilConsumer } from "./utils/queue-config.js";
import { connectRabbitMQ } from "./utils/rabbit-mq.js";

async function bootstrap() {
 

  try {
    await connectRabbitMQ();
    await startUtilConsumer();
    console.log("✅ RabbitMQ connected");
  } catch (err) {
    console.error("❌ Failed to connect RabbitMQ:", err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Auth service running on port ${PORT}`));
}

bootstrap();
