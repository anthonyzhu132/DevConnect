const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

//Connecting to MONGODB
connectDB();

app.get('/', (req, res) => {
  res.send('API HAS CONNECTED WITH EXPRESS')
})

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => {
  console.log(`Express server is lisening on port ${PORT}`)
});