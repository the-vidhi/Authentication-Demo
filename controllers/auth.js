const passport = require('passport');
const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const joi = require('joi');
const jwt = require('jsonwebtoken');
require("../middlewares/passport")

exports.signup = async (req,res)=>{
    res.render('signup');
};
exports.PostSignup = async(req,res)=>{
    console.log('signup Post controller');
    try{
        const payload = req.body;
        const now = Date.now();
        const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18));    
       
        const getEmail = await UserModel.findOne({ email: payload.email});

        if(getEmail){
            return res.status(409).json({status: false, message: "User already Exists!!!"});
        }
         let isAdmin = req.body.isAdmin;
            console.log("+=_+",isAdmin);

            if(isAdmin){
                getRole = await RoleModel.findOne({ rolename: isAdmin })
            }
            else{
                getRole = await RoleModel.findOne({ rolename: 'user' })
            }

            req.body.rolename=getRole._id;
            let user = await UserModel.create(req.body);
            console.log(user);
            const body = { _id: user._id, firstName: user.firstName, email: user.email};
            res.status(200).json({status: true, message: "Signup done successfully."});
        }
    catch(err) { console.log("jhjhj");}
}

exports.login = async (req,res)=>{
    res.render('login');
};

exports.PostLogin = async (req,res,next)=>{
    console.log("HEyyuyyyyyy");
    passport.authenticate('login', async(err, user, info)=>{
        try{
            console.log("HEyyy");
            if(err || !user){
                return res.status(422).json({status: false, message: "Invalid Email or Password"});
            }
            req.login(user, {session: false}, async(error)=>{
                if(error) return next(error);
                const getRole = await RoleModel.findById(req.user.rolename, (err,data)=>{
                    if(!err){
                        console.log("Data:", data.rolename);
                    }
                })
                const body = { _id: user._id, email: user.email, rolename:getRole.rolename };
                let token = jwt.sign({ user: body }, process.env.SECRET_TOKEN);
                user = body;
                if(getRole.rolename=="admin"){
                    return res.json({ token:token, user:body, id:user._id, route:"/post/index" });
                }
                else if(getRole.rolename=="user"){
                    return res.json({ token:token, user:body, id:user._id, route:"/post/home" });
                }  
                return res.json({ token:token, user:body, route:"/admin/index" });
            })
        }
        catch(error){
            return next(error);
        }
    })(req,res,next);
};

