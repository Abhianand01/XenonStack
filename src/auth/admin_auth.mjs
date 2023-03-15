import express from "express";
import jsonwebtoken from "jsonwebtoken"


export const isAdmin = async (req, res, next)=>{
    try{
        const token = req.cookies.access_token;
        if(!token)
        {
            throw new Error("You are not authorised");
        }

        else
        {
            const check = jsonwebtoken.decode(token);
            if(check.role === 'admin')
                next();
            else{ throw new Error("You are not authorised");
        }
            
        }
    }
    catch(error)
    {
        return res.send({'Error': error.message});
    }
}