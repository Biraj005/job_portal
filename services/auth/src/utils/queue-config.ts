import amqplib from "amqplib";

let channel: amqplib.Channel;
let connection;
export async function connectToRabbitMQ() {
  try {
    connection = await amqplib.connect(
      process.env.RABBITMQ_URL! || "amqp://localhost"
    );
    channel = await connection.createChannel();
    await channel.assertQueue("message_service");
  } catch (error) {
    console.log(error);
  }
}

export const sendDataToQueue = async (data: any) => {
  try {
    channel.sendToQueue("message_service", Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (error) {
    console.log("Error sending data to queue:", error);
  }
};
