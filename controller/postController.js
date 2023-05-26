const { Post } = require("../model/postModel");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const KEY = process.env.SECRET_KEY;

const get = async (req, res, next) => {
  try {
    const { ...params } = req.query;

    const result = await Post.find({ ...params }, "-createdAt -updatedAt");
    res.json({
      status: "success",
      code: 200,
      data: { posts: result },
    });
  } catch (e) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found contact id`,
      data: "Not Found",
    });
    next(e);
  }
};
const getMy = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, KEY);

    const result = await Post.find({ owner: id }, "-createdAt -updatedAt");
    res.json({
      status: "success",
      code: 200,
      data: { posts: result },
    });
  } catch (e) {
    res.json({
      status: "error",
      code: 404,
      message: `Not found contact id`,
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
  const {
    title,
    name,
    petBirthday,
    breed,
    price,
    sex,
    location,
    description,
    category,
    avatar,
  } = req.body;

  try {
    const result = await Post.create({
      title,
      name,
      petBirthday,
      breed,
      price,
      sex,
      location,
      description,
      category,
      avatar,
      owner: id,
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

const update = async (req, res, next) => {
  const { postId } = req.params;
  const { _id: owner } = req.user;
  const { ...params } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(
      { _id: postId, owner },
      {
        ...params,
      }
    );
    if (!result) {
      res.json({
        status: "error",
        code: 400,
        message: `missing field`,
        data: "Not Found",
      });
    }
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

const remove = async (req, res, next) => {
  const { postId } = req.params;
  const { _id: owner } = req.user;
  try {
    if (!postId) {
      res.json({
        status: "error",
        code: 400,
        message: `missing field`,
        data: "Not Found",
      });
    }
    const result = await Post.findByIdAndRemove({ _id: postId, owner });
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

const upStatus = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  const { favorite } = req.body;
  try {
    if (!postId) {
      res.json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    const result = await Post.findByIdAndUpdate(
      { _id: postId },
      { favorite },
      { new: favorite.push(_id) }
    );
    if (!result) {
      res.json({
        status: "error",
        code: 400,
        message: `missing field favorite`,
        data: "Not Found",
      });
    }
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${postId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not Found",
    });
    next(e);
  }
};

const getFav = async (req, res, next) => {
  try {
    const { _id: favorite } = req.user;
    const { ...params } = req.query;

    const result = await Post.find(
      { favorite, ...params },
      "-createdAt -updatedAt"
    );
    res.json({
      status: "success",
      code: 200,
      data: { posts: result },
    });
  } catch (e) {
    res.json({
      status: "error",
      code: 404,
      message: `Not found contact id`,
      data: "Not Found",
    });
    next(e);
  }
};

module.exports = {
  get,
  getMy,
  create,
  update,
  remove,
  upStatus,
  getFav,
};
