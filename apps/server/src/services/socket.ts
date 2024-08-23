import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "caching-2d81d858-gojoxsukuna3-0aef.i.aivencloud.com",
  port: 15324,
  username: "default",
  password: "AVNS_eBvLzdj-pWPYpkha2zs",
});

const sub = new Redis({
  host: "caching-2d81d858-gojoxsukuna3-0aef.i.aivencloud.com",
  port: 15324,
  username: "default",
  password: "AVNS_eBvLzdj-pWPYpkha2zs",
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

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("Broadcasting message to clients:", message);
        io.emit("event:message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
