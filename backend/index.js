const { connectDB } = require('./src/config/db.js');
const app = require('./app.js');

app.get('/', (req, res) => {
  res.send('Backend running inside Docker in local 🚀');
});

// Connect DataBase
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });
