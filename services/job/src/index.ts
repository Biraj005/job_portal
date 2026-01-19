import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {

  const PORT = process.env.PORT || 3004;
  app.listen(PORT, () => console.log(`🚀 Job service running on port ${PORT}`));
}

bootstrap();
