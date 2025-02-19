import { connect } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log("already connected to database 😁");
    return;
  }
  try {
    const db = await connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully 👍");
    console.log("db", db);
  } catch (error) {
    console.log("database connection failed 😭", error);

    process.exit(1);
  }
}

export default dbConnect;
