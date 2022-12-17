const express=require("express");
const mongoose=require("mongoose");
const route=require("./Route/router");
const app=express();

app.use(express.json())

mongoose.connect("mongodb+srv://Backend-Developer:VOsRhEoMTbd0U6U6@cluster0.a48nwas.mongodb.net/task-1Database?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log("mongoDB is connected"))
.catch((err)=>console.log(err.message))

app.use("/",route)

app.listen(3000,()=>{
    console.log("Express is Running on port 3000")
})