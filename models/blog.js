const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type: String
    },
    blog:{
        type: String
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
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertb'
    }
})

const blogtModel = mongoose.model('blogtb', blogSchema);   
module.exports =  blogtModel 