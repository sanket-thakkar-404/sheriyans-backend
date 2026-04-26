require('dotenv').config()
const http = require('http');
const app = require('./src/app');
const connectedToDb = require('./src/config/database.config')
const PORT = process.env.PORT


connectedToDb()


const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`server is running in Port ${PORT}`)
})