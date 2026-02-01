const express = require('express');
const app = express();
const notesRouter = require('./routes/notes.routes')


app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello server is running for day-7")
})

app.use('/api/notes', notesRouter)

module.exports = app

