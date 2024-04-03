const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [false, "Please enter the name of the user "],
  },
  email: {
    type: String,
    requird: [false, "Please enter your email address"],
  },
  password: {
    type: String,
    required: [false, "Please enter your password"],
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  resettoken: {
    type: String,
  },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  ],
});

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetTokens = crypto.randomBytes(20).toString("hex");

  // HAsing and adding resetPAsswordToken to userSchema
  this.resettoken = crypto
    .createHash("sha256")
    .update(resetTokens)
    .digest("hex");

  return resetTokens;
};

module.exports = mongoose.model("User", userSchema);
