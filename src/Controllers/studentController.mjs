import bcrypt from "bcrypt";
import dotenv from "dotenv";
import studentModel from "../Models/studentModel.mjs";
import jsonwebtoken from "jsonwebtoken";
import subjectModel from "../Models/subjectsModel.mjs";
import mongoose from "mongoose";
import marksModel from "../Models/marksModel.mjs";
import contactModel from "../Models/contactModel.mjs";

dotenv.config();

export const register = async (req, res) => {
  try {
    let cryptsalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, cryptsalt);
    if(req.body.semester%2==0) {req.body.year = req.body.semester/2} else{ req.body.year = Math.floor((req.body.semester/2 + 1))}
    req.body.role = "student";
    let userObj = await new studentModel(req.body).save();
    jsonwebtoken.sign(
      userObj.toJSON(),
      process.env.AUTH_SECRET_KEY,
      (err, token) => {
        if (err) return res.send({ error: err, status: 400 });
        else {
          return res.send({
            data: { token: token, msg: "Successfully Registered" },
            status: 200,
          });
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
    const data= req.body;
    const formdata = await contactModel(data).save();
    if(!formdata)
    {
      return res.send({
        error: "Can't Submit",status:400
      })
    } 
    else{
      return res.send({msg:"Successfully Submitted", status:200})
    }
  } catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // using Aggregation
    const studentList = await studentModel.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "semester",
          foreignField: "semester",
          as: "subject",
        },
      },
      {
        $lookup:{
          from: "marks",
          localField: '_id',
          foreignField: 'student',
          as: 'marks'
        }
      }
    ]);

    if (studentList) {
      return res.send({
        message: "Successfully fetched",
        data: studentList,
        status: 200,
      });
    }
  } catch (err) {
    res.send({ error: err.name, status: 400 });
  }
};

export const getDetails = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    const id = jsonwebtoken.decode(token)._id;

    const data = await studentModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "subjects",
          let:{ department: "$department", semester:"$semester" },
          pipeline:[{
            $match:{
            $expr:{
              $and:[{
                $eq:['$department', '$$department']},
                {$eq:['$semester', '$$semester']}
              ]
            }
          }
          }],
          as: "subject",
        },
      },
      {
        $project:{
          name: 1,
          department: 1,
          semester: 1,
          subject: 1,
          role: 1
        }
      },
    ]);
   
    const subject = data[0].subject;
    const marks = await marksModel.find({subject: data[0].subject, student: data[0]._id}).populate("subject", 'name').populate('teacher', 'name');
    
    const mergeById = (arr1, arr2) =>{
      for(let i=0; i<arr1.length; i++)
      {
        for(let j=0; j<arr2.length; j++)
        {
          if(arr1[i]._id.equals(arr2[j].subject._id))
          {
              Object.assign(arr1[i], {marks: arr2[j].marks});
              Object.assign(arr1[i], {teacher: arr2[j].teacher.name});
          }
        }
      }
    }

    const newData = mergeById(subject, marks);



    // return res.send({ message: "Fetched the details", data: data});

    res.render('student', {data: data})

  } catch (err) {
    res.send({ data: { name: err.name, message: err.message }, status: 400 });
  }
};
// logout for student 

export const logout = async(req, res)=>{
  try{
    res.clearCookie("access_token");
    res.redirect('/');
  }
  catch (error) {
    return res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
}
