const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  passwordConfirm: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  // token: {
  //   type: String,
  // },
  status: {
    type: String,
    enum: ["Online", "Offline"],
  },
  otp: {
    type: String,
  },
  otp_expiry_time: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  socket_id: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", async function (next) {
  // only run this function if otp is actually modified and not empty
  if (!this.isModified("otp") || !this.otp) return next();

  // Hash the otp with the cost of 12
  this.otp = await bcrypt.hash(this.otp, 12);

  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew || !this.password)
    return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  // if (this.passwordChangedAt) {
  //   const changedTimeStamp = parseInt(
  //     this.passwordChangedAt.getTime() / 1000,
  //     10
  //   );
  //   return JWTTimeStamp < changedTimeStamp;
  // }

  // // FALSE MEANS NOT CHANGED
  // return false;
  return JWTTimeStamp < this.passwordChangedAt;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
