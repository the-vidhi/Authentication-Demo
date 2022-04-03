const passport = require('passport');
const UserModel = require('../models/user')

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    try {
      console.log("*************** 02");
      if (err || info || !user) {
        const error = err || info.message;
        return res.status(401).json({status:false, message:"Unauthorized access"})
      }
      
      if(roles !== undefined){
        roles = typeof roles === 'string' ? [roles] : roles ;
        // console.log("----",roles);
        if(!roles.includes(user.rolename.rolename)){
            console.log(user.rolename.rolename);
            // res.status(403).send("You don't have sufficient access permission!");
            return res.status(403).json({ status: false ,message: "You don't have sufficient access permission!"})
            // throw new Error({status: 403, message: "You don't have sufficient access permission!"});
        }           
      }
      req.user = user;
         return next();
    } catch (err) {next(err);}
  };

exports.isAuth = (roles) => (req, res, next) => {
    passport.authenticate('authentication',{ session: false }, handleJWT(req, res, next, roles))(req, res, next)
};

exports.isActive = async (req,res,next)=> {
  const userRole = await UserModel.findOne({_id: req.user._id});
  if(userRole.isActive == true){
      return next();
  }
  else{
    return res.status(403).json({status: false,message:"You Are Not Activated Now"})
  }  
}
