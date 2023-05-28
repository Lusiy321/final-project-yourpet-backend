const express = require("express");
const { validation, userAuth } = require("../../service/userAuth");
const { joiUserLoginSchema } = require("../../model/userModel");
const usersController = require("../../controller/userController");

const router = express.Router();

router.post(
  "/register",
  validation(joiUserLoginSchema),
  usersController.signupUser
);

router.post(
  "/login",
  validation(joiUserLoginSchema),
  usersController.loginUser
);
router.post("/logout", userAuth, usersController.logoutUser);

router.put("/update", userAuth, usersController.updateUser);

router.get("/", usersController.getUser);

module.exports = router;
