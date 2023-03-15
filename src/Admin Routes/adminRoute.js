import express, { Router } from "express";
import * as adminController from "../Admin Controller/adminController.mjs"
import { isAdmin } from "../auth/admin_auth.mjs";


const AdminRouter = express.Router();

//login and register for adimin
AdminRouter.post('/register', adminController.register);
AdminRouter.post('/login', adminController.login);


AdminRouter.post('/addsubjects', isAdmin, adminController.addSubject);

AdminRouter.post('login', );


export default AdminRouter;