import express from "express";
import { auth } from "../auth/auth.mjs";
import * as studentController from "../Controllers/studentController.mjs"

const studentRouter = express.Router();


//post request
studentRouter.post('/register', studentController.register);
studentRouter.post('/login', studentController.login);

//get request
studentRouter.get('/', auth, studentController.getDetails);
studentRouter.post('/logout', auth, studentController.logout);




export default studentRouter;