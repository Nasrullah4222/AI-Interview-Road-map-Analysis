const mongoose = require("mongoose");

async function conntectDB() {
    try{
        console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DataBase.");
    }catch(err){
        console.log(err);
    }
    
}

module.exports = conntectDB;