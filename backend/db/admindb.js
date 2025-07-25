import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let adminConnection;

const Admindb = async () => {
  try {
    adminConnection = await mongoose.createConnection(process.env.AEDBC).asPromise();
    console.log(`✅ Admin DB Connected: ${adminConnection.name}`);
    return adminConnection;
  } catch (err) {
    console.error(`❌ Admin DB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default Admindb;
