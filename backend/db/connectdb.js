import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBC, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectdb;
