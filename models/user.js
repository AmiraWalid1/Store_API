const  {Schema, model} = require('mongoose');

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: 'user', enum:  ['user', 'admin', 'supervisor']},
  }
);

const User = model("user", userSchema);

module.exports = {User}
