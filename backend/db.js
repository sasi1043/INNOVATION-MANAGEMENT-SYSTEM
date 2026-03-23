const mongoose =require("mongoose")


module.exports= async=()=>{
    const url=process.env.DB;
    try{
    mongoose.connect(url)
    .then(console.log("mongoDB connected"));
    }
    catch(e){
        console.log({error:e.message});
        }
    }