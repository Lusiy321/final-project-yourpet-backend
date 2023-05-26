const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
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
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

module.exports = {
  Post,
};
