import dotenv from "dotenv";
import db_connection from "./database/db_connection.js";
import { app } from "./app/app.js";
dotenv.config({ path: "./.env" });

db_connection(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`server is live at http://localhost:5000`)
    );
  })
  .catch((error) => {
    console.log(`error occured during connecting to database ${error}`);
  });
