const mongoose = require("mongoose");

async function conntectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to DataBase.");
    }catch(err){
        console.log(err);
    }
    
}

module.exports = conntectDB;