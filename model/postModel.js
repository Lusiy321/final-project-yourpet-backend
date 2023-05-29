const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const nameRegexp = /^[a-zA-Z. ']+$/;

const postSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 1,
      maxlength: 254,
      require: [true, "Set title for your post"],
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 40,
      require: [true, "Set name for your pet"],
    },
    petBirthday: {
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

    price: {
      type: String,
      minlength: 1,
      maxlength: 18,
      default: "0",
    },
    sex: {
      type: String,
      minlength: 4,
      maxlength: 6,
      require: [true, "Set sex for your pet"],
    },

    description: {
      type: String,
      minlength: 10,
      maxlength: 280,
      require: [true, "Set description for your post"],
    },
    category: {
      type: String,
      enum: ["sell", "lost-found", "for-free"],
      default: "sell",
    },
    location: {
      type: String,
      minlength: 3,
      maxlength: 80,
      default: "Kyiv",
    },
    avatar: {
      type: String,
      default: "",
    },
    favorite: {
      type: Array,
      default: [],
    },
    owner: {
      type: Object,
    },
  },
  { versionKey: false, timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

const postJoi = Joi.object({
  title: Joi.string().min(2).max(60).required(),
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  petBirthday: Joi.string().min(10).max(10).required(),
  breed: Joi.string().min(2).max(15).required(),
  price: Joi.string().min(2).max(15).required(),
  sex: Joi.string().min(4).max(6).required(),
  location: Joi.string().min(2).max(15).required(),
  avatar: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().min(2).max(200).required(),
});

module.exports = {
  Post,
  postJoi,
};
