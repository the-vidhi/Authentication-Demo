const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostDetailsSchema = new Schema({
    file:{
      type: String
    },
    mimetype:{
      type: String
    },
    fieldName:{
      type: String
    },
    fileName:{
      type: String
    },
    size:{
      type: String
    },
    path:{
      type: String
    },
    post:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posttb'
    }
  });

  const postDetailsModel = mongoose.model('postDetailstb', PostDetailsSchema); 
  module.exports =  postDetailsModel 