const mongoose = require('mongoose');



const connectedToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DataBase Connected Successfully')
  } catch (err) {
    console.error('Error in Connecting Db :' , err.message)
  }
}




module.exports = connectedToDb