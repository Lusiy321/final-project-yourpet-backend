const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Joi = require("joi");
const emailRegexp =
  /^[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+(?:\.[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]/;
const nameRegexp = /^[a-zA-Z. ']+$/;
const phoneRegexp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[ -./0-9]*$/;
const bcrypt = require("bcryptjs");

const postSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      require: [true, "Set name for contact"],
    },
    email: {
      type: String,
      minlength: 6,
      maxlength: 40,
      require: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      minlength: 12,
      maxlength: 16,
      require: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = mongoose.model("posts", postSchema);

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set  name"],
      unique: true,
      match: nameRegexp,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
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

const joiUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});
const User = mongoose.model("users", usersSchema);

const contactsSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().pattern(phoneRegexp).length(14).required(),
  favorite: Joi.boolean(),
});

module.exports = {
  User,
  Contact,
  joiUserLoginSchema,
  joiUserSignUpSchema,
  joiUserSubscriptionSchema,
  contactsSchema,
};
