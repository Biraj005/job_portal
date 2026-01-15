import amqplib, { Channel, Connection } from "amqplib";
import { sendMail } from "./nodemailer-config.js";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

const EXCHANGE_NAME = "app_events";
const QUEUE_NAME = "notification_service_queue";
const ROUTING_KEY = "SEND_EMAIL";

let connection;
let channel: Channel;

export async function startNotificationService() {
  try {

    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();


    await channel.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

 
    await channel.bindQueue(
      QUEUE_NAME,
      EXCHANGE_NAME,
      ROUTING_KEY
    );

    console.log("📨 Notification Service is listening for SEND_EMAIL events");

    // 5️⃣ Consume messages
    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      try {
        const { to, subject, html } = JSON.parse(
          msg.content.toString()
        );
        await sendMail({ to, subject, html });
        channel.ack(msg);
      } catch (error) {
        console.error("❌ Email sending failed:", error);
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ connection failed:", error);
    process.exit(1);
  }
}
