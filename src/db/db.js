import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;

mongoose.connect(url, (err, result)=>{
    if(err) { console.log(err) } else {console.log("Connected to database..")}
})
