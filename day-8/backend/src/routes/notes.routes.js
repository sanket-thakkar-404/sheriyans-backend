const express = require('express');
const router = express.Router()
const notesModel = require('../model/notes.model')

// fetch all the notes
router.get('/', async (req, res) => {
  try {
    const notes = await notesModel.find();
    res.status(200).json({
      message: "All Notes Fetch Successfully",
      notes,
    })
  } catch (err) {
    console.error('Error in Getting Notes', err.message);
    res.status(500).json({ message: "internal server server error" })
  }
})

// creating Notes 
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title && !description) return res.status(401).json({ message: "All Filed are Required" })

    const note = await notesModel.create({
      title,
      description,
    })
    res.status(201).json({
      message: "Notes Created Successfully",
      note,
    })
  } catch (err) {
    console.error('Error in Creating Notes', err.message);
    res.status(500).json({ message: "internal server server error" })
  }
})

// deleting Notes
router.delete('/:id', async (req, res) => {
  try {

    const id = req.params.id
    if (!id) return res.status(402).json({ message: "id Note found" })

    const note = await notesModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Notes Deleted Successfully",
      note,
    })
  } catch (err) {
    console.error('Error in Deleting Notes', err.message);
    res.status(500).json({ message: "internal server server error" })
  }
})

// Changing Description Notes
router.patch('/:id', async (req, res) => {
  try {

    const id = req.params.id
    if (!id) return res.status(402).json({ message: "id Note found" })

    const { description } = req.body;

    if (!description) return res.status(401).json({ message: "description not found" })

    await notesModel.findByIdAndUpdate(id, { description });

    res.status(200).json({
      message: "Notes Updated Successfully",
    })
  } catch (err) {
    console.error('Error in Updates Notes', err.message);
    res.status(500).json({ message: "internal server server error" })
  }
})


module.exports = router;