import amqplib from "amqplib";
import { sendMail } from "./nodemailer-config.js";
let channel: amqplib.Channel;
let connection;

export async function connectToRabbitMQ() {
  try {
    connection = await amqplib.connect(
      process.env.RABBITMQ_URL! || "amqp://localhost"
    );
    channel = await connection.createChannel();
    await channel.assertQueue("message_service",{durable:true});

    channel.consume("message_service",async (msg) => {
      const { to,subject, html, } = JSON.parse(Buffer.from(msg!.content).toString());
       await sendMail({to,subject,html});
      channel.ack(msg!);
    });
  } catch (error) {
    console.log(error);
  }
}
