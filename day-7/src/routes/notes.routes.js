const express = require('express')
const router = express.Router();
const notesModel = require('../models/notes.model');

// to create new notes
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title && !description) return res.status(400).json({ message: 'All Filed are required' })


    const note = await notesModel.create({
      title,
      description,
    })


    res.status(201).json({
      message: "Notes Created Successfully",
      note
    })
  } catch (err) {
    console.error("Error in created Notes :", err.message)
    res.status(500).json({
      message: "internal server Error"
    })
  }

})


// get all notes which are created 
router.get('/', async (req, res) => {
  try {
    const notes = await notesModel.find();

    res.status(200).json({
      message: "Notes fetched successfully",
      notes
    })
  } catch (err) {
    console.error("Failed To Fetched Notes", err.message)
    res.status(500).json({ message: "internal server Error" })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({
      message: "Id not Found"
    })

    const note = await notesModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Notes Deleted Successfully",
    })
  } catch (err) {
    console.error("Error In deleting Notes", err.message)
    res.status(500).json({
      message: "internal server Error"
    })
  }

})


router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({
      message: "Id not Found"
    })

    const { description } = req.body

    if (!description) return res.status(404).json({
      message: "description not found"
    })

    const note = await notesModel.findByIdAndUpdate(id, { description });

    res.status(200).json({
      message: "Notes Modified Successfully",
    })
  } catch (err) {
    console.error("Error In deleting Notes", err.message)
    res.status(500).json({
      message: "internal server Error"
    })
  }

})






module.exports = router

