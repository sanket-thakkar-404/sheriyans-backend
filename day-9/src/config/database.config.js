const mongoose = require('mongoose');


const connectedToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Db Connected Successfully");
  } catch (err) {
    console.error('Failed to Connect Database : ' , err.message);
    process.exit(1)
  }
}



module.exports = connectedToDb;