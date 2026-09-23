import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initializeSocket = (
  httpServer: HttpServer
) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client joins a board room
    socket.on("join-board", (boardId: string) => {
      const room = `board:${boardId}`;

      socket.join(room);

      console.log(
        `Socket ${socket.id} joined ${room}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
};