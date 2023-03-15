import express from "express";
import jsonwebtoken from "jsonwebtoken"


export const isTeacher = async (req, res, next)=>{
    try{
        const token = req.cookies.access_token;
        if(!token)
        {
            throw new Error("You are not authorised");
        }

        else
        {
            const user = jsonwebtoken.decode(token);
            if(user.role === 'teacher' && user.role!= 'student' && user.role!='admin')
            {
                res.locals._id = user._id
                res.set({
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                    "Surrogate-Control": "no-store"
                  });
                next();
            }
            else{ throw new Error("You are not authorised");
        }
            
        }
    }
    catch(error)
    {
        return res.send({'Error': error.message});
    }
}