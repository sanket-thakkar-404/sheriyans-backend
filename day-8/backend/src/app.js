const express = require('express');
const app = express();
const notesRoutes = require('./routes/notes.routes')
const cors = require('cors')
const path = require('path')


app.use(express.static('./public'))
app.use(express.json());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }))


app.use(cors())



// routes 
app.use('/api/notes', notesRoutes);

// middle ware for routing
// app.use('*name', (req, res) => {
//   res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
// })



module.exports = app;