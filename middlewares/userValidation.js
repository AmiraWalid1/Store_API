const {
  body
} = require("express-validator");
const {User} = require('../models/user');

const validateRegister= [
  body("username")
    .trim()
    .notEmpty().withMessage("name feild is required")
    .isLength({min: 2}).withMessage("Name must be at least 2 characters long")
  ,body("email")
    .isEmail().withMessage('Please enter a valid email')
    .custom(async (email)=>{
      const existingUser = await User.findOne({email});
      if (existingUser){
        throw new Error('Email is already in use');
      }
    })
  ,body("password")
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
];

const validateLogin = [
  body("email")
    .isEmail().withMessage('Please enter a valid email')
  ,body("password")
    .trim()
    .notEmpty().withMessage("Password feild is required")
];

module.exports = {validateRegister, validateLogin};
