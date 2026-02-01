require('dotenv').config()
const app = require('./src/app')
const http = require('http')
const PORT = process.env.PORT
const connectedToDb = require('./src/config/database')

connectedToDb()



const server = http.createServer(app);


server.listen(PORT, ()=>{
  console.log('Server is Running in Port 3000')
})