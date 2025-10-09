const { connectDB } = require('./src/config/db.js');
const app = require('./app.js');
const { initializeSocket } = require('./src/config/socket.config.js');
const http = require('http');

// Initialize Socket.io
const server = http.createServer(app);
initializeSocket(server);

app.get('/', (req, res) => {
  res.send('Backend running inside Docker in local 🚀');
});

// Connect DataBase
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });
