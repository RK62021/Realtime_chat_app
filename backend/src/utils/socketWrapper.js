// utils/socketWrapper.js
function wrapSocketEvent(handler) {
  return async function (...args) {
    const socket = this; // "this" is the socket
    try {
      await handler.apply(socket, args);
    } catch (err) {
      console.error('Socket error:', err);
      // Send structured error to client
      socket.emit('error', {
        message: err.message || 'Internal server error',
        code: err.code || 'SOCKET_ERROR',
      });
    }
  };
}

module.exports = wrapSocketEvent;
