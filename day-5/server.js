const http = require('http');
const app = require('./src/app');

const connectedToDb = require('./src/config/db')

connectedToDb()


const server = http.createServer(app);


server.listen(3000 , ()=>{
  console.log('server is running in the port 3000')
})