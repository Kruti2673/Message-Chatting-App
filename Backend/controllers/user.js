const User = require("../models/user");
const filterObj = require("../utils/filterObj");
const Service = require("../services/userService");
const bcrypt = require("bcrypt");
const FriendRequest = require("../models/friendRequest");

exports.updateMe = async (req, res, next) => {
  const { user } = req;
  const filteredBody = filteObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );
  const updated_user = await User.findByIdandUpdate(user._id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: updated_user,
    message: "Profile Updated successfully",
  });
};

exports.GetAllUser = async (req, res) => {
  try {
    var query = { status: "true" };

    const ServiceRes = await Service.getAllUserService(query);
    console.log("\nServices:", ServiceRes);

    return res.status(200).send({ status: true, response: ServiceRes.result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err });
  }
};

exports.getUsers = async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const this_user = req.user;

  const remaining_users = all_users.filter((user) => {
    return (
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
    );
  });

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
};

exports.getRequests = async (req, res, next) => {
  const requests = await FriendRequest.find({
    recipient: req.user._id,
  }).populate("sender", "_id firstName lastName");

  res.status(200).json({
    status: "success",
    data: requests,
    message: "Friends requests Found successfully!",
  });
};

exports.getFriends = async (req, res, next) => {
  const this_user = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName"
  );

  res.status(200).json({
    status: "success",
    data: this_user.friends,
    message: "Friends Found successfully!",
  });
};

exports.getUser = async (req, res) => {
  try {
    const UserId = req.params.id;

    const data = await User.findById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ status: false, error: "Service not found" });
    }

    const getService = await Service.getUserService(UserId);

    console.log("\nget Service:", getService);

    return res.status(200).send({
      status: true,
      response: getService,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: false,
      error: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const reqData = req.body;

    // Check if the new password is provided
    if (reqData.password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(reqData.password, 10);
      reqData.password = hashedPassword;
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const updatedUser = await Service.updateUserService(userId, reqData);

    console.log("\nUpdated User:", updatedUser);

    return res.status(200).send({
      status: true,
      response: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: false,
      error: err,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: false, error: "User not found" });
    }
    const deletedService = await Service.deleteUserService(req.params.id);
    console.log("\ndeleted User:", deletedService);

    return res.status(200).json({ status: true, data: deletedService });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: "Something went wrong" });
  }
};
