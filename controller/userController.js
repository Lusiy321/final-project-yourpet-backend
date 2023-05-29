const { Unauthorized, Conflict } = require("http-errors");
const { User } = require("../model/userModel");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const KEY = process.env.SECRET_KEY;

const getUser = async (req, res, next) => {
  try {
    const { ...params } = req.query;

    const result = await User.find({ ...params }, "-createdAt -updatedAt");
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

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const authentificationUser = await User.findOne({ email });
    if (
      !authentificationUser ||
      !authentificationUser.comparePassword(password)
    ) {
      throw new Unauthorized(`Email or password is wrong`);
    }

    const payload = {
      id: authentificationUser._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(authentificationUser._id, { token });
    return res.json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res, next) {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    return res.json({
      status: "success",
      code: 204,
      data: {
        token: null,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function signupUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const registrationUser = await User.findOne({ email });
    if (registrationUser) {
      throw new Conflict(`User with ${email} in use`);
    }

    const newUser = new User({ email });
    newUser.setPassword(password);
    newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        newUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
  }
  const { id } = jwt.verify(token, KEY);
  const { ...params } = req.body;

  try {
    const result = await User.findByIdAndUpdate({ _id: id }, { ...params });
    if (!result) {
      res.status(400).json({
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
        data: { user: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found user id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not Found",
    });
    next(e);
  }
};

module.exports = {
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
  getUser,
};
