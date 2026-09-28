const mongoose = require("mongoose");


async function connectDB() {
    try{
        console.log("🔄 Attempting MongoDB connection...");
        console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected!");
    }catch(err){
        console.error("❌ MongoDB Connection Failed:");
        console.log(err);
        throw err;

    }
    
}

module.exports = connectDB;