import express from "express";
import cors from "cors";
import path from "path";
import cookieParser  from "cookie-parser";
import * as dotenv from "dotenv";
import * as db from "./db/db.js"
import homeRouter from "./Routes/homeRoute.js";
import studentRouter from "./Routes/studentRoute.js";
import AdminRouter from "./Admin Routes/adminRoute.js";
import teacherRouter from "./Routes/teacherRoute.js";



dotenv.config();
const app = express()
const port = process.env.PORT;
const __dirname = path.resolve();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'))
app.use('/static',express.static(path.join(__dirname, '/src/public')))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/', (req, res)=>{
  res.render('index')
});


app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);


//admin route
app.use('/admin', AdminRouter);

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
