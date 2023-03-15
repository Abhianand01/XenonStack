import express from "express";
import { isTeacher } from "../auth/teacher_auth.mjs";
import * as teacherController from "../Controllers/teacherController.mjs";

const teacherRouter = express.Router();


//login and register for teacher
teacherRouter.post('/login', teacherController.login);
teacherRouter.post('/register', teacherController.register);


// teacherRouter.post('/addmarks', teacherController.addmarks);
teacherRouter.get('/getdetails', teacherController.getDetails);

teacherRouter.get('/', isTeacher, teacherController.getStudent);
teacherRouter.post('/addmarks', isTeacher, teacherController.addMarks);

teacherRouter.post('/logout', isTeacher, teacherController.logout)

teacherRouter.get('/subjectStudent', isTeacher, teacherController.getSubject);
teacherRouter.get('/subject', isTeacher, teacherController.subjectStudent)


export default teacherRouter;



