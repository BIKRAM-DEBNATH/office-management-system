import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import connectdb from "./db/connectdb.js";

const seedUser = async () => {
  try {
    await connectdb();
    const hashpassword = await bcrypt.hash("admin", 10);

    const newUser = new User({
      name: "BIKRAM",
      email: "bikramdebnath905@gmail.com",
      password: hashpassword,
      role: "admin"
    });

    await newUser.save();
    console.log("✅ Admin user created successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding user:", err.message);
  }
};

seedUser();
