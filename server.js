const {app} = require('./app');
const {connectDB}  = require('./models/db')
const port = process.env.port || 3000;

// Start server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
