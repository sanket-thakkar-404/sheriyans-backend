const express = require('express');
const app = express();



// middleware
app.use(express.json())

const notes = []


app.get('/', (req, res) => {
  res.send('server is ruining')
})

// it's create tha notes 
/**
 * POST METHOD (to create new thing )
 */
app.post('/notes', (req, res) => {
  notes.push(req.body)
  // console.log(notes)
  res.send('notes create successfully')
})


/**
 * GET METHOD (to get all thing that are created)
 */
// get all notes that exist
app.get('/notes', (req, res) => {
  res.send(notes)
})

/**
 * DELETE METHOD (to delete particular thing)
 */
// now we delete the notes
app.delete('/notes/:id', (req, res) => {
  delete notes[req.params.id]
  res.send('deleted successfully')
})

/**
 * PATCH METHOD (to update particular fields and change them)
 */
// now we update only one item
app.patch('/notes/:id', (req, res) => {
  notes[req.params.id].title = req.body.title
  res.send('update successfully')
})

/**
 * PUT METHOD (to update hole thing and get new update things)
 */
// now we update hole notes
app.put('/notes/:id', (req, res) => {
  const id = Number(req.params.id)

  const {title , description} = req.body

  notes[id].title = title;
  notes[id].description = description;


  res.send('change successfully')

})



module.exports = app