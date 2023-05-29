const { Post } = require("../model/postModel");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../model/userModel");
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

    const result = await Post.find({ "owner.id": id });
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
  const { _id } = req.user;
  try {
    const { email, phone } = await User.findOne({ _id });
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
      owner: { id, email, phone },
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
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  const { postId } = req.params;
  const { id } = jwt.verify(token, KEY);
  const { ...params } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(
      { _id: postId, owner: id },
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
    const result = await Post.findByIdAndRemove({ _id: postId, owner: id });
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
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  const { postId } = req.params;
  const { id } = jwt.verify(token, KEY);

  try {
    const document = await Post.findOne({ _id: postId });
    if (document) {
      const array = document.favorite;
      if (Array.isArray(array)) {
        const index = array.indexOf(id);

        if (index > -1) {
          array.splice(index, 1);
        } else {
          array.push(id);
        }
        await Post.updateOne(
          {
            _id: postId,
          },
          { $set: { favorite: array } }
        );
      }
    }
    if (!document) {
      res.json({
        status: "error",
        code: 404,
        message: `missing field`,
        data: "Not Found",
      });
    }
    return res.json({
      status: "success",
      code: 200,
      data: { post: document },
    });
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

const getFav = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, KEY);

    const result = await Post.find({ favorite: id });
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
