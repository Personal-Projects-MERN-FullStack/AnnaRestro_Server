const mongoose  = require("mongoose");

// const mongoURI ="mongodb+srv://vibeuser1:vaibhav@cluster0.9qofxzb.mongodb.net/vibebackend?retryWrites=true&w=majority";
const mongoURI = "mongodb://localhost:27017/annaRestro";

mongoose.set("strictQuery",true);

const connectToMongo =()=>{
    mongoose
    .connect(mongoURI)
    .then(()=>{
        console.log("Connected Successfully")
    })
    .catch((error)=>{
        console.error("Error Connecting to MongoDB :" , error);
    })
}

module.exports = connectToMongo;