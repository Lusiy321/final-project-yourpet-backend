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
    title: {
      type: String,
      minlength: 10,
      maxlength: 60,
      require: [true, "Set title for your post"],
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 40,
      require: [true, "Set name for your pet"],
    },
    birthday: {
      type: String,
      minlength: 10,
      maxlength: 10,
      require: [true, "Set birthday date for your pet"],
    },
    breed: {
      type: String,
      minlength: 3,
      maxlength: 20,
      require: [true, "Set breed for your pet"],
    },
    place: {
      type: String,
      minlength: 2,
      maxlength: 20,
      require: [true, "Set your place"],
    },
    sex: {
      type: String,
      minlength: 4,
      maxlength: 6,
      require: [true, "Set sex for your pet"],
    },
    email: {
      type: String,
      minlength: 10,
      maxlength: 18,
      require: [true, "Set birthday date for your pet"],
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 18,
      require: [true, "Set birthday date for your pet"],
    },
    description: {
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

const Post = mongoose.model("posts", postSchema);

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

const User = mongoose.model("users", usersSchema);

const contactsSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().pattern(phoneRegexp).length(14).required(),
  favorite: Joi.boolean(),
});

module.exports = {
  User,
  Post,
  joiUserLoginSchema,
  joiUserSignUpSchema,
  contactsSchema,
};
