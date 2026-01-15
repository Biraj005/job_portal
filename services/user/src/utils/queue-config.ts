import { getChannel,connectRabbitMQ } from "./rabbit-mq.js";
import { EXCHANGE_NAME } from "./rabbit-mq.js";
import prisma from "../lib/prisma.js";
export enum ROUTING_KEYS {
  USER_CREATED = "USER_CREATED",
  SEND_EMAIL = "SEND_EMAIL",
}

export async function startUtilConsumer() {
  await connectRabbitMQ();
  const channel = getChannel();

  const QUEUE = "util_service_queue";

  await channel.assertQueue(QUEUE, { durable: true });

  await channel.bindQueue(
    QUEUE,
    EXCHANGE_NAME,
    ROUTING_KEYS.USER_CREATED
  );

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    await prisma.userProfile.create({
      data,
    });

    channel.ack(msg);
  });

  console.log(" Util service listening for USER_CREATED");
}
