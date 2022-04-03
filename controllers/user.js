const UserModel = require('../models/user');

exports.userlist = async(req,res,next) => {
    console.log("User controller called");
    try{
        res.render('userList');
    }
    catch(err){ console.log(err);  }
}

// 
exports.all = async(req,res,next) => {
    console.log("User controller called");
    try {
        const user = await UserModel.find({isDeleted: false})
        return res.status(200).json({status: true, data: user});
    } catch (error) { next(error); }
}

exports.statuschange = async (req, res, next) => {
    try {
        const id = req.params._id;
        const user = await UserModel.findById(id);
        
        if (!user){
            res.status(400).json({ message: "user not found"});
        }
        else{            
            if(user.isActive==true){
                UserModel.findByIdAndUpdate({_id: req.params._id}, { isActive: false }, { new: true}, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.status(200).json({
                            message: "User updated",
                            data: data,
                        });
                    }
                });
            }
            else{
                UserModel.findByIdAndUpdate({_id: req.params._id}, { isActive: true }, { new: true}, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.status(200).json({
                            message: "User updated",
                            data: data,
                        });
                    }
                });
            }
        }
    
      } catch (err) {
        console.log(err);
      }
}

