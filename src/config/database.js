const mongoose= require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
 "mongodb+srv://chaitanyab852:1k5ZbXemV2sAoTvQ@cluster0.vyyezdw.mongodb.net/devTinder"
    );
};

module.exports=connectDB;