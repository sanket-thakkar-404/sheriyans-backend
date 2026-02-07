const jwt = require('jsonwebtoken');



const generateToken = (userId, email) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT env variables missing');
  }

  const token = jwt.sign({ _id: userId, email }, JWT_SECRET)

  return token;

}



module.exports = generateToken;