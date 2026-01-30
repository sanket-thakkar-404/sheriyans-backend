const express = require('express');
const app = express();
const notesModel = require('./models/notes.model')


// middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send("server is running for day-6")
})

app.post('/notes', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const note = await notesModel.create({ title, description });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (err) {
    console.error("Create note error:", err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


app.get('/notes', async (req, res) => {
  try {
    const notes = await notesModel.find();
    res.status(200).json({
      message: "Fetched successfully",
      count: notes.length,
      notes,
    });
  } catch (err) {
    console.error("error in fetching notes", err.message)
    res.status(500).json({
      message: "Internal server error",
    });
  }
})



module.exports = app