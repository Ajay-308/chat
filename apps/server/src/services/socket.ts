import { Server } from "socket.io";
import Redis from "ioredis";
import prismaclient from "./prisma";
import { produceMessage } from "./kafka";
const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIST_PORT),
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIST_PORT),
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("socket started");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListener() {
    console.log("init listener");
    const io = this.io;

    io.on("connection", (socket) => {
      console.log("socket new connection", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("Received message from client:", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("Broadcasting message to clients:", message);
        io.emit("event:message", message);
        try {
          await produceMessage(message);
          console.log("Message sent to Kafka");
        } catch (error) {
          console.error("Error sending message to Kafka:", error);
        }
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
