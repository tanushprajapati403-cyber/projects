import http from "http";
import { initializeSocket } from "../socket.io/socket.js";

export const creatServerSocket = (app) => {
  const server = http.createServer(app); // Express app ko HTTP server banana
  initializeSocket(server); // Socket attach karna
  return server;
};



// socket  normal ccg :-
// import dotenv from "dotenv";
// dotenv.config();
// import http from "http";
// import app from "../src/app.js"; //ess mein express hain.
// import { initializeSocket } from "./socket.io/socket.js";

// // Express app ko HTTP server mein wrap karein
// const server = http.createServer(app);

// // Socket.io ko server ke sath attach karein
// initializeSocket(server);

// const PORT = process.env.PORT || 8000;

// server.listen(PORT ,  ()=>{
//   console.log("server is running" ,  PORT)
// })