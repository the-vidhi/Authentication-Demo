const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const axios = require('axios');
const { json } = require('express');
const circularJson = require('circular-json');
const CircularJSON = require('circular-json');

exports.index = async(req,res)=>{
    console.log("Admin controller called");
    try{
        res.render('index');
    }
    catch(err){ console.log(err);  }
}

exports.getAlbum = async(req,res)=>{
    try{
        console.log("Admin album called");
        let obj = await axios.get('https://jsonplaceholder.typicode.com/posts');    
        return res.status(200).json({status:true, data:JSON.stringify(obj.data)})
    }
    catch(err){
        console.log(err);
    }
    
}

