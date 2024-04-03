const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(
      res.status(401).json({
        message: "Please Login to Access this Resource",
      })
    );
  } else {
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodeData.user.id);
    req.user = await User.findById(decodeData.user.id);
    return next();
  }
};

module.exports = auth;
