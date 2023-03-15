import express from "express";
import {auth} from "../auth/auth.mjs";
import {home} from "../Controllers/homeController.mjs";

const homeRouter = express.Router();

homeRouter.get('/', auth ,home);


export default homeRouter;