const express = require('express');

const app = express();

// middlewares
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Server is running');
});


module.exports = app;