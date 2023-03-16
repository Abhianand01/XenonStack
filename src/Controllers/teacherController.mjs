import teacherModel from "../Models/teacherModel.mjs";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose, { mongo, Mongoose, Schema } from "mongoose";
import studentModel from "../Models/studentModel.mjs";
import marksModel from "../Models/marksModel.mjs";
import subjectModel from "../Models/subjectsModel.mjs";

export const register = async (req, res) => {
  try {
    let cryptsalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, cryptsalt);
    req.body.role = "teacher";
    let userObj = await new teacherModel(req.body).save();
    jsonwebtoken.sign(
      userObj.toJSON(),
      process.env.AUTH_SECRET_KEY,
      (err, token) => {
        if (err) return res.send({ error: err, status: 400 });
        else {
          // return res.send({
          //   data: { token: token, msg: "Successfully Registered" },
          //   status: 200,
          // });

          res.redirect('/')
        }
      }
    );
  } catch (error) {
    res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let teacherList = await teacherModel.findOne({ email: email });

    if (!teacherList) {
      res.send({ error: { message: "Teacher not registered" }, status: 400 });
    } else {
      const pwd = await bcrypt.compare(password, teacherList.password);

      if (pwd) {
        const token = jsonwebtoken.sign(
          teacherList.toJSON(),
          process.env.AUTH_SECRET_KEY
        );
        res.cookie("access_token", token, { httponly: true });

        // return res.send('/',{
        //   Success: { message: "Successfully Logged In", data: studentList },
        //   status: 200,
        // });

        //render method goes here after success login

        res.redirect("/teacher");
      } else {
        return res.send({
          error: { message: "Incorrect Password or Email" },
          status: 400,
        });
      }
    }
  } catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

export const logout = async(req, res)=>{
  try{
    res.clearCookie("access_token");
    res.redirect('https://sta-u04k.onrender.com');
  }
  catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
}

export const getDetails = async (req, res) => {
  try {
    const id = jsonwebtoken.decode(req.cookies.access_token)._id;
    const getTeacher = await teacherModel
      .findOne({ _id: id }, { password: 0 })
      .populate("subjects", "-year")
      .exec();
    res.send({
      Success: { message: "Successfully Fetched", data: getTeacher },
      status: 200,
    });
  } catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    const id = res.locals._id;
    // console.log(id);
    const getStudents = await teacherModel.aggregate([
      {
        $match:
        {
          _id: new mongoose.Types.ObjectId(id)
        } 
      },
      {
        $lookup: {
          from: "students",
          localField: "department",
          foreignField: "department",
          as: "students",
        },
      },
      {
        $project:{
          name: 1,
          department: 1,
          subjects: 1,
          students:{
            _id: 1,
            name:1,
            department: 1,
            semester:1,
          },
          role: 1
        }
      },
    ]);

    const subject = getStudents[0].subjects
    
    const subjects = await subjectModel.find({_id: {$in: subject}})

    Object.assign(getStudents[0], {subjects: subjects});

    if (!getStudents) {
      res.send({
        error: { message: "Unable to fetch the details" },
        status: 400,
      });
    } else {

      // after teacher login
      // return res.send({
      //   Success: {
      //     message: "Successfully Fetched",
      //     data: getStudents,
      //     subjects: subjects
      //   },
      //   status: 200,
      // });

      res.render('teacher', {data: getStudents, subject: subjects})
    }
  } catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

export const addMarks = async (req, res)=>{
  try{
    req.body.teacher = res.locals._id
    const data = await marksModel(req.body).save();
    if(!data)
    {
      return res.send({
        error: { message: error.message, name: error.name },
        status: 400,
      });
    }
    else{
      return res.send({"Success":{"Message": "Successfully added the marks", "data": data}})
    }
  }
  catch(error)
  {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
}


export const getSubject = async (req, res)=>{
  try{    
    const student = await subjectModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query)
        }
      },
      {
        $lookup:{
          from: 'students',
          
          let: {'dept': '$department', 'sem': '$semester'},

          pipeline:[{
            $match:{
            $expr:{
              $and:[{
                $eq:['$department', '$$dept']},
                {$eq:['$semester', '$$sem']}
              ]
            }
          },
          
          },{
            $project:{
              password: 0,
              email: 0,
              year: 0
            }
          }],

          as: 'students'
        }
      }
    ])
    res.send({'Success': {'message': 'Successfully Fetched', data: student}})
    console.log(student)
  }
  catch(error)
  {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
}



export const subjectStudent = async(req, res)=>{
  try{
    console.log()
    res.render('subjectStudent')
  }
  catch(error)
  {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400, 
  })
}
}
