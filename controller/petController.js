const { Pet } = require("../model/petModel");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const KEY = process.env.SECRET_KEY;

const get = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, KEY);

    const result = await Pet.find({ "owner.id": id });
    res.json({
      status: "success",
      code: 200,
      data: { posts: result },
    });
  } catch (e) {
    res.json({
      status: "error",
      code: 404,
      message: `Not found`,
      data: "Not Found",
    });
    next(e);
  }
};

const create = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  const { id } = jwt.verify(token, KEY);
  const { name, petBirthday, breed, comments, avatar } = req.body;

  try {
    const result = await Pet.create({
      name,
      petBirthday,
      breed,
      comments,
      avatar,
      owner: { id },
    });
    if (!result) {
      return res.json({
        status: "error",
        code: 404,
        message: `Not found data`,
        data: "Not Found",
      });
    }
    res.json({
      status: "success",
      code: 201,
      data: { post: result },
    });
  } catch (e) {
    res.json({
      status: "error",
      code: 404,
      message: `Not found`,
      data: "Not Found",
    });
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  const { postId } = req.params;
  const { id } = jwt.verify(token, KEY);
  try {
    if (!postId) {
      res.json({
        status: "error",
        code: 400,
        message: `missing field`,
        data: "Not Found",
      });
    }
    const result = await Pet.findByIdAndRemove({ _id: postId, owner: id });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { post: result },
      });
    } else {
      res.json({
        status: "error",
        code: 404,
        message: `Not found post id: ${postId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.json({
      status: "error",
      code: 400,
      message: `missing field`,
      data: "Not Found",
    });
    next(e);
  }
};

module.exports = {
  get,
  create,
  remove,
};
