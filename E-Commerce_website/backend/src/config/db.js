import { connect } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

const connect_db = asyncHandler(async () => {
  await connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);

  console.log(`database connected successfully..👍`);
});

export default connect_db;
