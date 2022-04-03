const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fname:{
    type: String    
  },
  lname:{
    type: String    
  },
  dateofbirth:{
    type: Date
  },
  technology:{
    type: String    
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rolename:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roletb'
  },
  isDeleted:{
    type: Boolean,
    default: false
  },
  isActive:{
    type: Boolean,
    default: false
  }
});

UserSchema.pre('save', async function(next){
  const user = this;
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function(password){
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}
const UserModel = mongoose.model('usertb', UserSchema);
module.exports = UserModel;