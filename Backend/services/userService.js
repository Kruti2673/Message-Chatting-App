const User = require("../models/user.js");

module.exports.Create = async (user) => {
  return User.create(user)
    .then((result) => {
      console.log("added User" + result);

      return { status: true, result };
    })
    .catch((err) => {
      console.log(err);
      return { status: false, err };
    });
};

module.exports.getAllUserService = async (query = {}) => {
  // console.log("query", query);
  return User.find(query)
    .sort({ createdAt: -1 })
    .then((users) => {
      // console.log("result", { status: true, result: users })
      return { status: true, result: users };
    })
    .catch((err) => {
      return { status: false, error: err };
    });
};

exports.getUserService = async (UserId) => {
  return User.findByIdAndUpdate({ _id: UserId }, { new: true })
    .then((result) => {
      return { status: true, result };
    })
    .catch((err) => {
      console.log(err);
      return { status: false, err };
    });
};

exports.updateUserService = async (UserId, updatedData) => {
  return User.findByIdAndUpdate(
    { _id: UserId },
    {
      $set: { ...updatedData },
    },
    { new: true }
  )
    .then((result) => {
      return { status: true, result };
    })
    .catch((err) => {
      console.log(err);
      return { status: false, err };
    });
};

exports.deleteUserService = async (id) => {
  return User.findOneAndUpdate(
    { _id: id },
    { $set: { status: false } },
    { new: true }
  )
    .then((result) => {
      return { status: true, result };
    })
    .catch((err) => {
      console.log(err);
      return { status: false, err };
    });
};
