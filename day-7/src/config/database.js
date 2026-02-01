const mongoose = require('mongoose');


const connectedToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DB Connected successfully')
  } catch (err) {
    console.error('Db Connect Failed :' ,err.message)
    process.exit(1)
  }
}


module.exports = connectedToDb