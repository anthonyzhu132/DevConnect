const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API HAS CONNECTED WITH EXPRESS')
})

app.listen(PORT, () => {
  console.log(`Express server is lisening on port ${PORT}`)
});