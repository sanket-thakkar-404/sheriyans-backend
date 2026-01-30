const express = require('express')
const app = express()




app.get('/' , (req,res)=>{
  res.send('server is ruining for day-5')
})


module.exports = app