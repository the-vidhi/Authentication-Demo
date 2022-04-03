const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    rolename:{
      type: String
    }
})
const RoleModel = mongoose.model('roletb', RoleSchema);
module.exports = RoleModel;