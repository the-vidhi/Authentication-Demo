const postModel = require('../models/post');
const postDetailsModel = require('../models/postDetails')
const joi = require('joi');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { required } = require('joi');
const { prototype } = require('events');




exports.adminindex = async (req, res, next) => {
  try {
    res.render('admin');
  }
  catch (err) { console.log(err); }
}
exports.userindex = async (req, res, next) => {
  try {
    res.render('user');
  }
  catch (err) { console.log(err); }
}

exports.show = async (req, res) => {
  let data = null;
  console.log("----", req.params.entity);
  let role = req.user.rolename.rolename;
  try {
    if (req.params.entity != role) {
      res.status(403).json({ status: "error", message: "You are not authorized to access this page" })
    } else {
      let _query = { isDeleted: false };
      if (req.params.id) {
        console.log("------req.params.id-----\n", req.params.id);
        _query['_id'] = req.params.id;
        data = await postModel.findOne(_query).populate({ path: 'user', select: 'fname lname' });
      } else {
        data = await postModel.find(_query).populate({ path: 'user', select: 'fname lname' }).populate({ path: 'image', select: 'file fileName' });
      }
      return res.status(200).json({ data: data });
    }
  }
  catch (error) { console.log(error); }
}

exports.store = async (req, res, next) => {  
  try {
    let arr = [];
    let fileData = req.files.image;
    
    console.log("----",req.files);    
    if(req.files){
      console.log("nullll");
    }

    const payload = {
      title: req.body.title,
      desc: req.body.desc,
      image: req.files.image && req.files.pancard
    } 

    let joiVal = joi.object().keys({
      title: joi.string().min(3).max(20).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required(),
      desc: joi.string().min(3).max(30).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required(),
      image: joi.required()
    })

    const Validation = joiVal.validate(payload);
    const { value, error } = Validation;
    if (error) {
      console.log(error);
      return res.status(422).json({ status: false, message: Validation.error.message });
    }
    else {
      let panData = req.files.pancard[0];
      for (const element of fileData) {
        const getfiledata = {
          file: '/uploads/' + element.filename,
          mimetype: element.mimetype,
          fieldName: element.fieldname,
          fileName: element.filename,
          path: element.path,
          size: element.size
        }
        const getDetails = await postDetailsModel.create(getfiledata);
        arr.push(getDetails._id);
      }

  
      const getpanData = {
        file: '/uploads/' + panData.filename,
        mimetype: panData.mimetype,
        fieldName: panData.fieldname,
        fileName: panData.filename,
        path: panData.path,
        size: panData.size
      }
      console.log(getpanData.file,"----------------");
      const getPostDetails = await postDetailsModel.create(getpanData);
      arr.push(getPostDetails._id)     

      payload.user = req.user._id;
      payload.image = arr
      const post = await postModel.create(payload);

      for (let i = 0; i < post.image.length; i++) {
        await postDetailsModel.findByIdAndUpdate({ _id: post.image[i] }, { post: post._id })
        console.log("--", post.image[i]);
      }
      res.status(200).send("Post Stored")
    }
  } catch (error) { console.log(error); }
}

exports.destroy = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const userId = req.user._id;
    const _query = { _id, isDeleted: false };
    const _delete = { $set: { isDeleted: true, deletedAt: new Date(), deletedBy: userId } };
    await postModel.findOneAndUpdate(_query, _delete);
    res.status(200).json({ status: true, message: "post deleted" });
  } catch (error) { next(error); }
}

exports.update = async (req, res) => {
  try {
    const id = req.params._id;

    let joiVal = joi.object().keys({
      title: joi.string().min(3).max(20).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required(),
      desc: joi.string().min(3).max(50).regex(/^[A-Za-z ]*$/, 'Only Alphabets Allowed').required()
    })

    let obj = {
      title: req.body.title,
      desc: req.body.desc
    }

    const Validation = joiVal.validate(obj);
    const { value, error } = Validation;
    if (error) {
      return res.status(422).json({ status: false, message: Validation.error.message });
    }
    else {
      const post = await postModel.findById(id);

      if (!post) {
        res.status(400).json({ message: "post not found" });
      }
      else {
        postModel.findByIdAndUpdate({
          _id: req.params._id,
        }, {
          title: req.body.title,
          desc: req.body.desc,
          updatedAt: Date.now()
        }, {
          new: true
        }, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({
              message: "post updated",
              data: data,
            });
          }
        });
      }
    }

  } catch (err) {
    console.log(err);
  }
};
