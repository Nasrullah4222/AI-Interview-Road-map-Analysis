const mongoose = require("mongoose");
/*
async function conntectDB() {
    try{
        console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DataBase.");
    }catch(err){
        console.log(err);
    }
    
}
*/

const connectDB = async () => {
    try {
        console.log("🔄 Attempting MongoDB connection...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:");
        console.error(error.message);

        throw error;
    }
};

module.exports = conntectDB;