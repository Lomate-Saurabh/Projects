import app from "./app/app.js";
import dotenv from "dotenv";
import connect_db from "./config/db.js";
dotenv.config({ path: "./.env" });

connect_db();

app.listen(process.env.PORT || 5000, () =>
  console.log(`server is live on port ${process.env.PORT || 5000}`)
);
