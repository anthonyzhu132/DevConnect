const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

//Connecting to MONGODB
connectDB();

app.get('/', (req, res) => {
  res.send('API HAS CONNECTED WITH EXPRESS')
})

app.listen(PORT, () => {
  console.log(`Express server is lisening on port ${PORT}`)
});