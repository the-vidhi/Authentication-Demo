const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
      type: String
    },
    desc:{
      type: String
    },
    image:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'postDetailstb'
    }],
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usertb'
    },
    isDeleted:{
      type: Boolean,
      default: false
    },
    deletedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usertb',
      default: null
    },
    deletedAt:{
      type: Date,
      default: null
    },
    createdAt:{
      type: Date,
      default: Date.now()
    },
    updatedAt:{
      type: Date,
      default: null
    }
  });

  const postModel = mongoose.model('posttb', PostSchema); 
  module.exports =  postModel 