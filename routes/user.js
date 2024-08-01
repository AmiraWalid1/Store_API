const express = require('express');
const {User} = require('../models/user')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticate} = require('../middlewares/authenticate')
const {Registration, Login} = require('../middlewares/userValidation');
const { validationResult } = require('express-validator');
const router = express.Router();

// Register new user
router.post('/register',Registration, async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {username, email, password} = req.body;
  const passwordEncrypted = await bcryptjs.hash(password, 10);
  const newUser = new User({username, email, password: passwordEncrypted});  
  try{
    await newUser.save();
    res.status(201).json(newUser);
  } catch(err) {
    next(err);
  }
});

// Login user
router.post('/login', Login, async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRETKEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
  
});

// Promote user to supervisor
router.patch("/promote", authenticate ,async(req, res, err) =>{
  console.log(req.user);
  if (req.user.role !== 'admin'){
    return res.status(403).send("Forbidden: Insufficient permissions");
  }

  const {userId} = req.body;
  try{
    const user = await User.findByIdAndUpdate(userId, {role: "supervisor"});
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.status(200).json(user);
  }
  catch(err){
    next(err);
  }
});

module.exports = router;
