const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const SECRET_KEY = "UserApi";
const bcrypt = require("bcrypt");
const createUser = require("../services/userService.js");
const crypto = require("crypto");
const { promisify } = require("util");
const mailService = require("../services/mailer.js");
const otp = require("../Templates/Mail/otp.js");
const otpGenerator = require("otp-generator");
const { use } = require("../app.js");
const filterObj = require("../utils/filterObj.js");
const nodemailer = require("nodemailer");
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

// exports.register = async (req, res) => {
//   try {
//     const existUser = await User.findOne({ email: req.body.email });
//     if (existUser) {
//       return res
//         .status(400)
//         .json({ status: false, error: "User already exists,Please login" });
//     }
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     req.body.password = hashedPassword;

//     const result = await createUser.Create(req.body);

//     const token = jwt.sign({ id: result._id }, SECRET_KEY);

//     console.log("\nUser:", result);

//     return res.status(200).send({ status: true, user: result, token });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const existUser = await User.findOne({ email: req.body.email });
//     if (!existUser) {
//       return res.status(400).json({ status: false, error: "User Not Found" });
//     }

//     if (!existUser || !existUser.password) {
//       console.log("\nUser or password not found\n");
//       return res.status(400).json({ error: "Invalid Credentials" });
//     }

//     // const matchPassword = await bcrypt.Compare(
//     //   req.body.password,
//     //   existUser.password
//     // );

//     const userPassword = String(req.body.password);
//     const existingUserPassword = String(existUser.password);

//     const matchPassword = await bcrypt.compare(
//       userPassword,
//       existingUserPassword
//     );

//     if (!matchPassword) {
//       console.log("\nInvalid Credentials, You can't login\n");
//       return res.status(400).json({ erroe: "Invalid Credentials" });
//     }

//     if (existUser.Status == false) {
//       console.log("\nCannot login: User is inactive\n");
//       return res.status(400).json({ error: "User is inactive" });
//     }

//     const token = jwt.sign({ id: existUser._id }, SECRET_KEY);
//     c

//     return res.status(200).json({ user: existUser, token: token });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("\nBoth email and password are required\n");
      return res.status(400).json({
        status: "error",
        message: "Both email and password are required",
      });
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !user.password) {
      console.log("\nIncorrect password\n");
      return res.status(400).json({
        status: "error",
        message: "Incorrect password",
      });
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      console.log("\nEmail or password is incorrect\n");
      return res.status(400).json({
        status: "error",
        message: "Email or password is incorrect",
      });
    }

    const token = signToken(user._id);
    console.log("\nYou are successfully logged in\n");
    return res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      user_id: user._id,
    });
  } catch (error) {
    console.error(error);
    console.log("\nYou are not logged in\n");
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Protect
exports.protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // if (!token) {
  //   return res.status(401).json({
  //     message: "You are not logged in! Please log in to get access.",
  //   });
  // }
  else {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
    });
  }
  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //console.log(decoded);

  // 3) Check if user still exists

  const this_user = await User.findById(decoded.userId);
  if (!this_user) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exists.",
    });
  }
  // 4) Check if user changed password after the token was issued
  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password! Please log in again.",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = this_user;
  next();
};

// exports.forgotPassword = async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).json({
//       status: "error",
//       message: "There is no user with email address.",
//     });
//     return;
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to user's email
//   try {
//     const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;
//     // TODO => Send Email with this Reset URL to user's email address

//     console.log(resetURL);

//     mailService.sendEmail({
//       from: req.body.email,
//       to: user.email,
//       subject: "Reset Password",
//       html: resetPassword(user.firstName, resetURL),
//       attachments: [],
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return res.status(500).json({
//       message: "There was an error sending the email. Try again later!",
//     });
//   }
// };

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with that email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to the user's email
  try {
    const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krutivadaliya7@gmail.com",
        pass: "wpxg rntc kshb jyrx",
      },
    });

    const mailOptions = {
      from: "krutivadaliya7@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "There was an error sending the email. Try again later!",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          status: "success",
          message: "Token sent to email!",
        });
      }
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
};

//reset password
exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has expired, and  submission is out of time window
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
    return;
  }

  //3) Update user password and set resetToken & expiry to undifined
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reseted Successfully",
    token,
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "krutivadaliya7@gmail.com",
    pass: "wpxg rntc kshb jyrx",
  },
});

// reagister new
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const filteredBody = filterObj(req.body, "firstName", "lastName", "email");
  filteredBody.password = hashedPassword;
  // check if a verified user with given email exists

  const existing_user = await User.findOne({ email: email });

  if (existing_user) {
    // user with this email already exists, Please login
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  } else if (existing_user) {
    // if not verified than update prev one

    await User.findOneAndUpdate({ email: email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    // generate an otp and send to email
    req.userId = existing_user._id;
    next();
  } else {
    // if user is not created before than create a new one
    const new_user = await User.create(filteredBody);

    // generate an otp and send to email
    req.userId = new_user._id;
    next();
  }
};

// sent OTP
// exports.sendOTP = async (req, res, next) => {
//   const { userId } = req;
//   const new_otp = otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     lowerCaseAlphabets: false,
//   });

//   const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

//   const user = await User.findByIdAndUpdate(userId, {
//     otp: new_otp,
//     otp_expiry_time,
//   });

//   user.otp = new_otp.toString();

//   await user.save({ new: true, validateModifiedOnly: true });

//   console.log(new_otp);

//   // TODO send mail
//   mailService.sendEmail({
//     from: "krutivadliya7@gmail.com",
//     to: user.email,
//     subject: "Verification OTP",
//     text: `Your OTP is ${new_otp}. This is valid for 10 Mins`,
//     html: otp(user.firstName, new_otp),
//     attachments: [],
//   });

//   res.status(200).json({
//     status: "success",
//     message: "OTP Sent Successfully!",
//   });
// };
exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findByIdAndUpdate(userId, {
    otp: new_otp,
    otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  console.log(new_otp);

  // Send OTP email using Nodemailer
  const mailOptions = {
    from: "krutivadaliya07@gmail.com",
    to: user.email,
    subject: "Verification OTP",
    text: `Your OTP is ${new_otp}. This is valid for 10 Mins`,
    html: `<p>Your OTP is <strong>${new_otp}</strong>. This is valid for 10 Mins</p>`,
    attachments: [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP email:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to send OTP email." });
    } else {
      console.log("OTP email sent:", info.response);
      res
        .status(200)
        .json({ status: "success", message: "OTP Sent Successfully!" });
    }
  });
};

//verify OTP
// exports.verifyOTP = async (req, res, next) => {
//   // verify otp and update user accordingly
//   const { email, otp } = req.body;
//   const user = await User.findOne({
//     email,
//     otp_expiry_time: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res.status(400).json({
//       status: "error",
//       message: "Email is invalid or OTP expired",
//     });
//   }

//   if (user.verified) {
//     return res.status(400).json({
//       status: "error",
//       message: "Email is already verified",
//     });
//   }

//   if (!(await user.correctOTP(otp, user.otp))) {
//     res.status(400).json({
//       status: "error",
//       message: "OTP is incorrect",
//     });
//   }

//   // OTP is correct
//   console.log("Heloo");

//   user.verified = true;
//   user.otp = undefined;
//   await user.save({ new: true, validateModifiedOnly: true });

//   const token = signToken(user._id);

//   res.status(200).json({
//     status: "success",
//     message: "OTP verified Successfully!",
//     token,
//     user_id: user._id,
//   });
// };

exports.verifyOTP = async (req, res, next) => {
  // verify otp and update user accordingly
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  // OTP is correct
  //console.log("Heloo");

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  return res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
  });
};

// // login user
// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   //console.log(email, password);

//   if (!email || !password) {
//     res.status(400).json({
//       status: "error",
//       message: "Both email and password are required",
//     });
//     return;
//   }

//   const user = await User.findOne({ email: email }).select("+password");

//   if (!user || !user.password) {
//     res.status(400).json({
//       status: "error",
//       message: "Incorrect password",
//     });

//     return;
//   }

//   if (!user) {
//     res.status(400).json({
//       status: "error",
//       message: "Email or password is incorrect",
//     });

//     return;
//   }

//   if (user.status === false) {
//     res.status(400).json({
//       status: "error",
//       message: "User is removed",
//     });

//     return;
//   }

//   const token = signToken(user._id);

//   res.status(200).json({
//     status: "success",
//     message: "Logged in successfully!",
//     token,
//   });
// };
