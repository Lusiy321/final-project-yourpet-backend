const express = require("express");
const {
  get,
  getMy,
  create,
  remove,
  update,
  upStatus,
} = require("../../controller/postController");
const { userAuth, validation } = require("../../service/userAuth");
const { postSchema } = require("../../model/postModel");

const router = express.Router();

router.get("/", get); // Запросить все посты

router.put("/:postId", userAuth, update); // Обновить пост

router.get("/:userId", userAuth, getMy); // Запросить посты по ID пользователя (owner)

router.post("/add", userAuth, validation(postSchema), create); // Создать пост

router.delete("/del/:postId", userAuth, remove); // Удалить пост

router.patch("/favorite/:postId", userAuth, upStatus); // Добавить или удалить из избранного

router.get("/favget/:userId", userAuth, getMy); // Запросить избранные посты по ID пользователя (favorit)

module.exports = router;
