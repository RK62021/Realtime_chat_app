const { connectDB } = require('./src/config/db.js');
const app = require('./app.js');
const { initializeSocket } = require('./src/config/socket.config.js');
const http = require('http');
const {redis} = require('./src/config/redis.js');
const initRedisSubscriber = require('./src/redis/subscriber.js');

// Initialize Socket.io
const server = http.createServer(app);
initializeSocket(server); // initialize socket with the server

// Initialize Redis Subscriber
initRedisSubscriber();

app.get('/', (req, res) => {
  res.send('Backend running inside Docker in local 🚀');
});

//test redis connection  
redis.set("test_key", "Hello, Redis!");
redis.get("test_key").then(value => {
  console.log("Redis test_key:", value);
}).catch(err => {
  console.error("Redis get error:", err);
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
