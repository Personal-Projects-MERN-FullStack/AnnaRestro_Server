const mongoose  = require("mongoose");

const mongoURI ="mongodb+srv://mohanalkarvaibhav:wc2oINT9F9fNiV1T@cluster0.ogti7se.mongodb.net/annaRestro";
// const mongoURI = "mongodb://localhost:27017/annaRestro";

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