const express = require("express");
const { validation, userAuth } = require("../../service/userAuth");
const {
  joiUserLoginSchema,
  joiUserSignUpSchema,
  joiUserSubscriptionSchema,
} = require("../../model/userModel");
const usersController = require("../../controller/userController");

const router = express.Router();

router.post(
  "/register",
  validation(joiUserSignUpSchema),
  usersController.signupUser
);

router.post(
  "/login",
  validation(joiUserLoginSchema),
  usersController.loginUser
);
router.post("/logout", userAuth, usersController.logoutUser);

router.get("/current", userAuth, usersController.currentUser);

router.patch(
  "/update",
  userAuth,
  validation(joiUserSubscriptionSchema),
  usersController.updateSubscriptionUser
);

router.get("/google", usersController.googleAuth);

router.get("/google-redirect", usersController.googleRedirect);

module.exports = router;
