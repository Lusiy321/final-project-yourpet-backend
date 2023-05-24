const mongoose = require("mongoose");
const { User } = require("./userModel");
const Schema = mongoose.Schema;

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
      type: Number,
      minlength: 1,
      maxlength: 18,
      default: null,
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
      maxlength: 180,
      require: [true, "Set description for your post"],
    },
    category: {
      type: String,
      enum: ["sell", "lost-found", "for-free"],
      require: [true, "Set category"],
    },
    avatar: {
      type: String,
      require: [true, "Set avatar link"],
      default: null,
    },
    owner: {
      type: String,
      require: User,
    },
  },
  { versionKey: false, timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

module.exports = {
  Post,
};
