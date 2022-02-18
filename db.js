const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://tauhidsaif26748:Mohd0000@inotebook.jbrgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const mongoURI = process.env.MONGODB_URL
 const connectToMongo =()=>{
     mongoose.connect( mongoURI,{ useNewUrlParser: true}, ()=>{
         console.log("connected to mongo successfully")
     })
 }

 module.exports = connectToMongo;