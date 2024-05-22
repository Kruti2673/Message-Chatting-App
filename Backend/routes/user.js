const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.js");
const authController = require("../controllers/auth.js");

router.patch("/update-me", authController.protect, userController.updateMe);
router.get("/get-user", userController.GetAllUser);
router.get("/get-user/:id", userController.getUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

router.get("/get-users", authController.protect, userController.getUsers);
router.get("/get-friends", authController.protect, userController.getFriends);
router.get(
  "/get-friend-requests",
  authController.protect,
  userController.getRequests
);

module.exports = router;
