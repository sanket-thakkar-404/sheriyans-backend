require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const PORT = process.env.PORT
const connectedToDb = require('./src/config/database.config')

connectedToDb()

const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`server is running in the Port ${PORT}`)
})