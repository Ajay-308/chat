import http from "http";
import SocketService from "./services/socket.js";

async function init() {
  const socketservice = new SocketService();
  const server = http.createServer();
  const Port = process.env.PORT ? process.env.PORT : 8000;
  socketservice.io.attach(server);
  server.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
  });
  socketservice.initListner();
}

init();
