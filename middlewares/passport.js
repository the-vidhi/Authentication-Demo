const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const RoleModel = require('../models/role');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const {secretKeys} = require('../config/index');

const jwtStrategyOpts = { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: secretKeys.jwt };
// const jwtStrategyOpts = { jwtFromRequest: ExtractJWT.fromHeader('secret-token'), secretOrKey: secretKeys.jwt };

passport.use('login',new localStrategy({usernameField: 'email',passwordField: 'password'},async (email, password, done) => {
    try
    {
        let user = await UserModel
      .findOne({ email})
      .populate({path:'rolename', select:'rolename'});
      console.log("ROLE:", user.rolename);
        if (!user){
            return done(null, false, { message: 'User not found' });
            // return sendJson(422,{status: false, message: "User Not Found"});
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }  
        return done(null, user, { message: 'Logged in Successfully' });
    }
    catch(error)
    {
        console.log(error);
        return done(error);
    }
}));

const authenticateJwtStrategy = async (jwtPayload, done) => {
try {
console.log("************ 01", jwtPayload.user);

    let user = await UserModel
    .findOne({_id: jwtPayload.user._id})
    .populate({path:'rolename', select:'rolename'});
    console.log("user is ",user.rolename.rolename);
    if (user) { return done(null, user); }
    else { return done('Invalid access token'); }
} catch (error) { done(error); }
};

passport.use('authentication',new JWTstrategy(jwtStrategyOpts, authenticateJwtStrategy));

