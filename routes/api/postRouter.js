const express = require("express");
const {
  get,
  getById,
  create,
  remove,
  update,
  upStatus,
} = require("../../controller/contactController");
const { userAuth, validation } = require("../../service/userAuth");
const { postSchema } = require("../../model/userModel");

const router = express.Router();

router.get("/", userAuth, get);

router.get("/:contactId", userAuth, getById);

router.post("/", userAuth, validation(postSchema), create);

router.delete("/:contactId", userAuth, remove);

router.put("/:contactId", userAuth, update);

router.patch("/:contactId/favorite", userAuth, upStatus);

module.exports = router;
