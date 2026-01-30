const express = require('express');
const app = express()

const notes = []

app.use(express.json())

app.get('/', (req, res) => {
  res.send('server is running')
})

// status code understanding
/**
 * if there is created something new use 
 * status code : 201
 */
app.post('/notes', (req, res) => {
  notes.push(req.body)
  res.status(201).json({
    message: "Notes created Successfully"
  })
})

/**
 * if we want to get something 
 * status code : 200
 */
app.get('/notes', (req, res) => {
  res.status(200).json({
    notes: notes,
  })
})


/**
 * if we want to delete  something 
 * status code : 204
 */
app.delete('/notes/:id', (req, res) => {
  delete notes[req.params.id]
  res.status(204).json({
    message : "Note Delete Successfully",
  })
})

/**
 * if we want to update  some items for our data 
 * status code : 200
 */
app.patch('/notes/:id', (req, res) => {
  notes[req.params.id].description = req.body.description
  res.status(200).json({
    message : "Note update Successfully",
  })
})


module.exports = app