const express = require("express");
const {
  get,
  getMy,
  create,
  remove,
  update,
  upStatus,
  getFav,
} = require("../../controller/postController");
const { userAuth, validation } = require("../../service/userAuth");
const { postJoi } = require("../../model/postModel");

const router = express.Router();

router.get("/", get); // Запросить все посты

router.put("/:postId", userAuth, update); // Обновить пост

router.get("/my", userAuth, getMy); // Запросить посты по ID пользователя (owner)

router.post("/add", userAuth, validation(postJoi), create); // Создать пост

router.delete("/del/:postId", userAuth, remove); // Удалить пост

router.put("/favorite/:postId", userAuth, upStatus); // Добавить или удалить из избранного

router.get("/favget/", userAuth, getFav); // Запросить избранные посты по ID пользователя (favorit)

module.exports = router;
