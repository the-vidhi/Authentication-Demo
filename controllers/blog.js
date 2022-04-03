const blogtModel = require("../models/blog")
const joi = require("joi")

exports.blogindexadmin = async(req,res)=>{
    try{
        res.render('blog');
    }
    catch(err){ console.log(err);  }
}
exports.blogindexuser = async(req,res,next)=>{
  try{
      res.render('blogUser');
  }
  catch(err){ console.log(err);  }
}
exports.all = async (req, res, next) => {
    try{
        let data = null
        let role = req.user.rolename.rolename
        if(req.params.entity != req.user.rolename.rolename){
            res.status(403).json({status: "error", message:"You are not authorized to access this pageeeee"})
        }
        else{
            let _query = { isDeleted: false };
            if (req.params._id) {
                _query['_id'] = req.params._id;
                data = await blogtModel.findOne(_query).populate({path: 'user', select: 'rolename'});
            }
            else{
                console.log("Blog all Called");
                data = await blogtModel.find({isDeleted: false}).populate({path: 'user', select: 'fname lname'});
            }  
            res.status(200).json({ data: JSON.stringify(data)})               
        }          
    }
    catch(err){
        console.log(err);
    }
}
exports.storeblog = async(req,res,next)=>{
    try{
          res.render('blogadd');        
    }
    catch(error) { console.log(error);}
}
exports.storeblogUser = async(req,res,) => {
    res.render('blogaddUser');
}

exports.store = async (req, res, next) => {
    try {
      let payload = req.body
      console.log(payload);      

      let joiVal = joi.object().keys({
          title: joi.string().min(3).max(20).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required(),
          blog: joi.string().required()
      })

      let obj = {
          title: req.body.title,
          blog: req.body.blog          
      }

      const Validation = joiVal.validate(obj);
      const {value, error} = Validation;
      if(error){
          return res.status(422).json({status: false, message: Validation.error.message});
      }
      else{
        payload.user = req.user._id;
        const blog = await blogtModel.create(payload);
        return res.status(200).send("Blog Stored")
      }
    } catch (error) { console.log(error); next(error); }
}

exports.destroy = async (req, res) => {
try {
    const _id = req.params._id;
    // console.log("==========",req.params.params.id);
    const userId = req.user._id;
    const _query = {_id, isDeleted: false};
    const _delete = {$set: {isDeleted: true, deletedAt: new Date(), deletedBy: userId}};
    await blogtModel.findOneAndUpdate(_query, _delete);
    res.status(200).json({ status: true, message: "blog deleted" });
    
} catch (error) {console.log(error); }
}
exports.update = async (req, res) => {
    try {
      const id = req.params._id;

      console.log(req.body,"--");
      let joiVal = joi.object().keys({
          title: joi.string().min(3).max(20).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required(),
          blog: joi.string().required()
      })

      let obj = {
          title: req.body.title,
          blog: req.body.blog          
      }

      const Validation = joiVal.validate(obj);
      const {value, error} = Validation;
      if(error){
          return res.status(422).json({status: false, message: Validation.error.message});
      }
      else{
          const post = await blogtModel.findById(id);
    
      if (!post){
          res.status(400).json({ message: "blog not found" });
      }
      else{
          blogtModel.findByIdAndUpdate({_id: req.params._id}, {title: req.body.title,blog: req.body.blog,updatedAt: Date.now() },  (err, data) => {
          if(err) {
              console.log(err);
          }
          else{
              res.status(200).json({ message: "blog updated", data: data });
          }})}
      } 
    } catch (err) {
      console.log(err);
    }
};
