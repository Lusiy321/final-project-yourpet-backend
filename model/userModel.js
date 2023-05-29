const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Joi = require("joi");
const emailRegexp =
  /^[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+(?:\.[-!#$%&'*+/=?^_`{|}~A-Za-z0-9]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]/;
const bcrypt = require("bcryptjs");
const names = uuidv4();

const usersSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 60,
      default: names,
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
      default: "00.00.0000",
    },

    phone: {
      type: String,
      minlength: 12,
      maxlength: 12,
      default: "+38000000000",
    },

    location: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Kyiv",
    },
    avatarURL: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: null,
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

const User = mongoose.model("users", usersSchema);

module.exports = {
  User,
  joiUserLoginSchema,
};
