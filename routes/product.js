const express = require('express');
const {Product} = require('../models/product')
const {authenticate} = require('../middlewares/authenticate');
const { validateProduct, validateProductUpdate } = require("../middlewares/productValidation")
const { validationResult } = require('express-validator');
const multer = require("multer");
const path = require('path')
const User = require('../models/user')

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: "files",
    filename: (req, file, func)=>{
      func(null, file.originalname);
    }
  })
});

//  Get all products (Public).
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// Add a new product (Admin and Supervisor).
router.post('/', validateProduct, authenticate , upload.single("imageFile"), async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
    return res.status(403).send("Forbidden: Insufficient permissions");
  }
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, imageUrl} = req.body;
  let imagePath;
  if(!req.file) {
    imagePath = imageUrl;
  } else {
    imagePath = path.join(__dirname,'../', req.file.path);
  }
  try {
    const product = new Product({ name, description, price, imagePath });
    await product.save();
    res.status(200).json(product);
  } catch(err) {
    next(err);
  }
  
});

// Edit a product by id (Admin only).
router.patch('/:id', validateProductUpdate, authenticate , upload.single("imageFile"), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send("Forbidden: Insufficient permissions"); 
  }
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, price, imageUrl} = req.body;
  const { id } = req.params;
  
  try {
    const product = await Product.findById(id);
    if (!product){
      return res.status(404).send("product not found");
    }

    const fields = { name, description, price, imagePath: imageUrl };
      
    // Update fields dynamically
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined) {
        product[key] = fields[key];
      }
    });

    if(req.file) {
      product.imagePath = path.join(__dirname,'../', req.file.path);
    }
  
    await product.save();
    res.status(200).json(product);
  } catch(err) {
    next(err);
  }
  
});


// Delete a product by id (Admin only).
router.delete('/:id', authenticate, async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send("Forbidden: Insufficient permissions");
  }

  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Product deleted successfully");
  } catch (err) {
    next(err);
  }
});


// Delete all products (Admin only, requires password confirmation).
router.delete('/', authenticate , async (req, res) => {
  try {
    const { password } = req.body; 

    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).send("Forbidden: You do not have permission");
    }

    // Validate password
    const user = await User.findById(req.user.id);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Unauthorized: Password confirmation failed.");
    }

    // Delete all products
    await Product.deleteMany({});
    res.status(204).send();
  } catch (err) {
    next(err);
  }
  
});

module.exports = router;
