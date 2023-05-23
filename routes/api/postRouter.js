const express = require("express");
const {
  get,
  getById,
  create,
  remove,
  update,
  upStatus,
  getMy,
} = require("../../controller/contactController");
const { userAuth, validation } = require("../../service/userAuth");
const { postSchema } = require("../../model/postModel");

const router = express.Router();

router.get("/", get);

router.get("/my", userAuth, getMy);

router.get("/:postId", userAuth, getById);

router.post("/add", userAuth, validation(postSchema), create);

router.delete("/del/:postId", userAuth, remove);

router.put("/:postId", userAuth, update);

router.patch("/:postId/favorite", userAuth, upStatus);

module.exports = router;
