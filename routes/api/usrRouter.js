const express = require("express");
const { validation, userAuth } = require("../../service/userAuth");
const { joiUserLoginSchema } = require("../../model/userModel");
const usersController = require("../../controller/userController");
const passport = require("passport");
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

router.get("/", userAuth, usersController.getUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect(
    "https://tetianazinchenko.github.io/final-project-yourpet-frontend/login"
  );
});

module.exports = router;
