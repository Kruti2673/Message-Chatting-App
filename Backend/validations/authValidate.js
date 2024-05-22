const Joi = require("joi");

module.exports.loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3).max(40).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    console.log("\n");
    console.log("Validation errors:");
    error.details.forEach((error) => {
      console.log(error);
    });
    return res.status(500).send({
      status: false,
      errors: error.details.map((error) => error),
    });
  }
};

// module.exports.registerValidation = async (req, res, next) => {
//   const schema = Joi.object({
//     firstName: Joi.string().required(),
//     lastName: Joi.string().required(),
//     avatar: Joi.string(),
//     email: Joi.string().email().required(),
//     password: Joi.string(),
//     passwordChangedAt: Joi.date(),
//     passwordResetToken: Joi.string(),
//     passwordResetExpires: Joi.date(),
//     status: Joi.boolean(),
//     verified: Joi.boolean().default(false),
//     createdAt: Joi.date(),
//     updatedAt: Joi.date(),
//   });

// module.exports.registerValidation = (req, res, next) => {
//   const user = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     avatar: req.body.avatar,
//     email: req.body.email,
//     password: req.body.password,
//     passwordChangedAt: req.body.passwordChangedAt,
//     passwordResetToken: req.body.passwordResetToken,
//     passwordResetExpires: req.body.passwordResetExpires,
//     status: req.body.status,
//     verified: req.body.verified,
//     createdAt: req.body.createdAt,
//     updatedAt: req.body.updatedAt,
//   };

//   const UserSchema = Joi.object({
//     firstName: Joi.string().alphanum().min(3).max(30).required(),
//     lastName: Joi.string().alphanum().min(3).max(30).required(),
//     avatar: Joi.string(),
//     email: Joi.string().email().required(),
//     password: Joi.string()
//       .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
//       .required(),
//     passwordChangedAt: Joi.date(),
//     passwordResetToken: Joi.string(),
//     passwordResetExpires: Joi.date(),
//     status: Joi.boolean(),
//     verified: Joi.boolean().default(false),
//     createdAt: Joi.date(),
//     updatedAt: Joi.date(),
//   }).options({ abortEarly: false });

//   UserSchema.validateAsync(user)
//     .then((result) => {
//       req.local = { ...req.local, user_data: user };
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//       let errors = err.details.map((val, id) => {
//         return { key: val.context.key, message: val.message };
//       });
//       return res.status(400).send({ status: false, errors });
//     });
// };

// const { error } = UserSchema.validate(req.body, { abortEarly: false });

// if (!error) {
//   next();
// } else {
//   console.log("\n");
//   console.log("Validation errors:");
//   error.details.forEach((error) => {
//     console.log(error);
//   });
//   return res.status(500).send({
//     status: false,
//     errors: error.details.map((error) => error),
//   });
// }

module.exports.registerValidation = (req, res, next) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
    passwordChangedAt: req.body.passwordChangedAt,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
    status: req.body.status,
    verified: req.body.verified,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
  };

  const UserSchema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    passwordChangedAt: Joi.date(),
    passwordResetToken: Joi.string(),
    passwordResetExpires: Joi.date(),
    status: Joi.boolean(),
    verified: Joi.boolean().default(false),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  }).options({ abortEarly: false });

  UserSchema.validateAsync(user)
    .then((result) => {
      req.local = { ...req.local, user_data: user };

      // Move the following block here
      const { error } = UserSchema.validate(req.body, { abortEarly: false });

      if (!error) {
        next();
      } else {
        console.log("\n");
        console.log("Validation errors:");
        error.details.forEach((error) => {
          console.log(error);
        });
        return res.status(500).send({
          status: false,
          errors: error.details.map((error) => error),
        });
      }
    })
    .catch((err) => {
      console.log(err);
      let errors = err.details.map((val, id) => {
        return { key: val.context.key, message: val.message };
      });
      return res.status(400).send({ status: false, errors });
    });
};
