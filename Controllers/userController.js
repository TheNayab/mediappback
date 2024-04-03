const express = require("express");
const User = require("../Models/userModel.js");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const app = express();

// Registration method
router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Please Enter A valid name"),
    body("email")
      .isEmail()
      .withMessage("Please Enter A Valid Email")
      .isLength({ max: 320 })
      .withMessage("Password must contain up to 320 characters")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Please Enter A Valid Password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .isLength({ max: 128 })
      .withMessage("Password must contain up to 128 characters")
      .matches(/[A-Z]/g)
      .withMessage("Password must contain an upper case letter")
      .matches(/[a-z]/g)
      .withMessage("Password must contain a lower case letter")
      .matches(/[0-9]/g)
      .withMessage("Password must contain a number")
      .not()
      .matches(/\s/g)
      .withMessage("Please do not use space characters"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user) {
          res.status(402).json({
            message: "This user is already exist",
          });
        } else {
          if (req.body.password === req.body.confirmPassword) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                res.status(500).json({
                  error: err.message,
                });
              } else {
                const users = new User({
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                });
                const data = {
                  user: {
                    id: users.id,
                  },
                };
                const authToken = jwt.sign(data, process.env.JWT_SECRET);

                users.save().then(() => {
                  res
                    .status(200)
                    .cookie("token", authToken, {
                      expires: new Date(Date.now() + 25892000000),
                      // httpOnly: true,
                    })
                    .json({
                      success: true,
                      message: `User registered successfully`,
                      users,
                    });
                });
              }
            });
          } else {
            res.status(400).json({
              success: false,
              message: "Password not matched",
            });
          }
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(400).json({
            success: false,
            message: "Resource not found",
          });
        }
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });
  }
);

//login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter A Valid Email")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Please Enter A Valid Password"),
  ],
  (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    User.findOne({ email: req.body.email })

      .exec()
      .then((user) => {
        if (!user) {
          res.status(401).json({
            message: "Invalid email or password ",
          });
        } else {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              res.status(401).json({
                message: "Invalid email or password",
              });
            }
            if (result) {
              const data = {
                user: {
                  id: user.id,
                },
              };
              const authToken = jwt.sign(data, process.env.JWT_SECRET);
              return res
                .status(200)
                .cookie("token", authToken, {
                  expires: new Date(Date.now() + 25892000000),
                  // httpOnly: true,
                })
                .json({
                  success: true,
                  authToken,
                  user,
                });
            }
            return res.status(401).json({
              message: "Invalid email or password",
            });
          });
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(400).json({
            message: "Resource not found",
          });
        }
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });
  }
);

// Logout
router.get("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occur",
    });
  }
});

module.exports = router;
