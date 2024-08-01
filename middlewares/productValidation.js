const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name field is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  
  body("description")
    .trim()
    .notEmpty().withMessage("Description field is required")
    .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
  
  body("price")
    .notEmpty().withMessage("Price field is required")
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),

  body("imageUrl")
    .isURL().withMessage("Image URL must be valid"),
];

const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
  
  body("price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),

  body("imageUrl")
    .optional()
    .isURL().withMessage("Image URL must be valid"),
];

module.exports = { validateProduct, validateProductUpdate };
