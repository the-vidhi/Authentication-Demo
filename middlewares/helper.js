const jwt = require('jsonwebtoken');
const joi = require('joi');

var fs  = require('fs');
var path = require('path');
const multer = require('multer');
const filepath = path.resolve('public/uploads')


exports.toObject = (json) => JSON.parse(JSON.stringify(json));

exports.generateJwt = (obj) => jwt.sign(obj, (process.env.JWT).jwt);

exports.removeFields = (obj, keys, defaultFields = true) => {
    var basicFields = ['_id','__v'];
    keys = typeof keys == 'string' ? [keys] : keys || [];
    if (defaultFields) keys = keys.concat(basicFields);
    keys.forEach((key) => delete obj[key]);
    return obj;
};
exports.valCheck = (req,res,next) => {
  const payload = req.body;
  const now = Date.now();
  const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18));    
  const joiVal = joi.object().keys({
      fname: joi.string().min(3).max(10).regex(/^[A-Za-z]*$/, 'Only Alphabets Allowed').required(),
      // fname: joi.string().min(3).max(10).regex(/^([\w]+(vidhi)*)$/, 'Only Alphabets Allowed').required(),
      lname: joi.string().min(3).max(10).regex(/^[A-Za-z]*$/, 'Only Alphabets Allowed').required(),
      dateofbirth: joi.date().max(cutoffDate).required(),
      technology:joi.string().min(3).max(10).regex(/^[A-Za-z]*$/, 'Only Alphabets allowed').required(),
      email: joi.string().min(3).max(20).regex(/^([\w-\.]+@(gmail+\.)+(com))?$/, 'Only Valid Email Format').required(),
      password: joi.string().min(3).max(10).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Enter Atleast one Capital Letter,Small Letter,Special Characters and Digit...').required(),
      isAdmin: joi.string()
  })

  const Validation = joiVal.validate(payload);
        const {value, error} = Validation;
        if(error){
            return res.status(422).json({status: false, message: Validation.error.message});
        }
        else{
          next();
        }
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
      console.log("--------------",filepath);
      cb(null, filepath)
  },
  filename: (req, file, cb) => {

    console.log("+++++++++++",file.originalname);
      let f = file.originalname.split('.');
      console.log("-----",f[0]);
      console.log("+++++++++++",file.originalname);
        console.log("Hello");
        cb(null, file.fieldname+'-' + Date.now() + path.extname(file.originalname))
    
      
  }
});
exports.upload = multer({ storage: storage });


