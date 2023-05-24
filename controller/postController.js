const { Post } = require("../model/postModel");

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
    const { _id: owner } = req.user;
    const { ...params } = req.query;

    const result = await Post.find(
      { owner, ...params },
      "-createdAt -updatedAt"
    );
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

const create = async (req, res, next) => {
  const {
    title,
    name,
    petBirthday,
    breed,
    price,
    sex,
    description,
    category,
    avatar,
  } = req.body;
  const { _id: owner } = req.user;
  try {
    const result = await Post.create({
      title,
      name,
      petBirthday,
      breed,
      price,
      sex,
      description,
      category,
      avatar,
      owner,
    });
    if (!result) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found data`,
        data: "Not Found",
      });
    }
    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    res.status(404).json({
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
  const {
    title,
    name,
    petBirthday,
    breed,
    price,
    sex,
    description,
    category,
    avatar,
  } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(
      { _id: postId, owner },
      {
        title,
        name,
        petBirthday,
        breed,
        price,
        sex,
        description,
        category,
        avatar,
      }
    );
    if (!result) {
      res.status(400).json({
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
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found post id: ${postId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
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
      res.status(400).json({
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
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found post id: ${postId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
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
  getMy,
  create,
  update,
  remove,
};
