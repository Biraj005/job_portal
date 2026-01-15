import amqplib, { Channel, Connection } from "amqplib";

let connection;
let channel: Channel;

export const EXCHANGE_NAME = "app_events";
export enum ROUTING_KEYS {
  USER_CREATED = "USER_CREATED",
  SEND_EMAIL = "SEND_EMAIL",
}

export async function connectRabbitMQ() {
  connection = await amqplib.connect(
    process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "direct", {
    durable: true,
  });

  console.log("✅ RabbitMQ connected");
}

export function getChannel(): Channel {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}
