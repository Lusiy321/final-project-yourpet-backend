const express = require("express");
const { get, create, remove } = require("../../controller/petController");
const { userAuth, validation } = require("../../service/userAuth");
const { petJoi } = require("./../../model/petModel");

const router = express.Router();

router.get("/", get); // Запросить посты

router.post("/add", userAuth, validation(petJoi), create); // Создать пост

router.delete("/del/:postId", userAuth, remove); // Удалить пост

module.exports = router;
