const { Server } = require('socket.io');
const SocketAuthMiddleware = require('../middleware/socket.middleware.js');
const wrapSocketEvent = require('../utils/socketWrapper.js');

let ioInstance = null;

function initializeSocket(server) {
  // create socket.io server
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // later change to specific domain
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // use socket authentication middleware
  io.use(SocketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log(
      `✅ User connected: ${socket.user.id} | Socket ID: ${socket.id}`
    );

    // Disconnection event
    socket.on('disconnect', (reason) => {
      console.log(
        `❌ User disconnected: ${socket.user.id} | Reason: ${reason}`
      );
    });


  });

  console.log('🚀 Socket.io initialized');
  ioInstance = io;
  return io;
}

function getIOInstance() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return ioInstance;
}

module.exports = { initializeSocket, getIOInstance };
