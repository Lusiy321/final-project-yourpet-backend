const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Joi = require("joi");
const emailRegexp =
  /^[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+(?:\.[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]/;
const nameRegexp = /^[a-zA-Z. ']+$/;
const bcrypt = require("bcryptjs");

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set  name"],
      unique: true,
      match: nameRegexp,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },

    birthday: {
      type: String,
      minlength: 10,
      maxlength: 10,
      require: [true, "Set birthday date for your pet"],
    },

    phone: {
      type: String,
      minlength: 12,
      maxlength: 16,
      require: [true, "Set phone for contact"],
    },

    location: {
      type: String,
      minlength: 2,
      maxlength: 20,
      require: [true, "Set your place"],
    },
    avatarURL: {
      type: String,
      required: true,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

usersSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const joiUserLoginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const joiUserSignUpSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const User = mongoose.model("users", usersSchema);

module.exports = {
  User,
  joiUserLoginSchema,
  joiUserSignUpSchema,
};
