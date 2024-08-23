import { Server } from "socket.io";

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
    this.initListner();
  }
  public initListner() {
    console.log("init listener");
    const io = this.io;
    io.on("connection", (socket) => {
      console.log("socket new connection", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("message", message);
        io.emit("event:message", { message });
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
