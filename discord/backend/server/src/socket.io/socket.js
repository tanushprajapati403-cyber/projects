import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Cliient connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};