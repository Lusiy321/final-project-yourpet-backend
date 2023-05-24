const express = require("express");
const {
  get,
  getMy,
  create,
  remove,
  update,
} = require("../../controller/postController");
const { userAuth, validation } = require("../../service/userAuth");
const { postSchema } = require("../../model/postModel");

const router = express.Router();

router.get("/", get);

router.put("/:postId", userAuth, update);

router.get("/my", userAuth, getMy);

router.post("/add", userAuth, validation(postSchema), create);

router.delete("/del/:postId", userAuth, remove);


module.exports = router;
