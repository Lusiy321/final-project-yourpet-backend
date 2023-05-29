const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const nameRegexp = /^[a-zA-Z. ']+$/;

const petSchema = new Schema(
  {
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

    comments: {
      type: String,
      minlength: 10,
      maxlength: 280,
      require: [true, "Set description for your pet"],
    },

    avatar: {
      type: String,
      default: "",
    },

    owner: {
      type: Object,
    },
  },
  { versionKey: false, timestamps: true }
);

const Pet = mongoose.model("pets", petSchema);

const petJoi = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  petBirthday: Joi.string().min(10).max(10).required(),
  breed: Joi.string().min(2).max(15).required(),
  avatar: Joi.string().required(),
  comments: Joi.string().min(2).max(200).required(),
});

module.exports = {
  Pet,
  petJoi,
};
