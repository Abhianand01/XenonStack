import AdminModel from "../Models/AdminModel.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import JsonWebToken from "jsonwebtoken";
import subjectModel from "../Models/subjectsModel.mjs";

dotenv.config();

//register for admin only one admin
export const register = async (req, res) => {
  try {
    let cryptsalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, cryptsalt);

    let hasAdmin = await AdminModel.find();
    if (hasAdmin.length == 0) {
      let userObj = await new AdminModel(req.body).save();
      JsonWebToken.sign(
        userObj.toJSON(),
        process.env.ADMIN_AUTH_KEY,
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
    } else {
      throw new Error("You are not authorised to access this page");
    }
  } catch (error) {
    res.send({
      error: { message: error.message, name: error.name },
      status: 400,
    });
  }
};

//login for admin
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await AdminModel.findOne({ email: email });

    if (!admin) {
      res.send({ error: { message: "Not Registered" }, status: 400 });
    } else {
      const pwd = await bcrypt.compare(password, admin.password);
      if (pwd) {
        const token = JsonWebToken.sign(
          admin.toJSON(),
          process.env.ADMIN_AUTH_KEY
        );
        res.cookie("access_token", token, { httponly: true });
        return res.send({
          Success: { message: "Successfully Logged In", data: admin },
          status: 200,
        }); //render method goes here after success login
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

//add subjects
export const addSubject = async (req, res) => {
  try {
    const addList = await subjectModel(req.body).save();

    if (addList) {
      return res.send({ message: "Successfully added the subject", data: addList });
    } else {
      throw "Can't add Subjects";
    }
  } catch (err) {
    return res.send({
      error: { name: err.name, message: err.message },
      status: 400,
    });
  }
};
