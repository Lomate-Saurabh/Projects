import { connect } from "mongoose";

const db_connection = async (url) => {
  try {
    connect(url);
    console.log(`database successfully connected `);
  } catch (error) {
    console.log(`error occured during connecting to database ${error}`);
  }
};

export default db_connection;
