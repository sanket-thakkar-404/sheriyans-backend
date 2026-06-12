import app from "./src/app.js";
import config from "./src/config/dotenv.config.js";
import connectedToDb from "./src/config/db.js";


connectedToDb()


app.listen(config.PORT, () => {
  console.log("Server is running in Port:",config.PORT)
})