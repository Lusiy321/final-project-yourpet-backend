const { Unauthorized, Conflict, NotFound } = require("http-errors");
const { User } = require("../model/userModel");
const queryString = require("node:querystring");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const URL = require("url");
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;

async function currentUser(req, res, next) {
  try {
    const { name, email } = req.user;
    res.json({
      status: "success",
      code: 200,
      data: {
        user: {
          name,
          email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

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
    res.status(204).json({
      status: "success",
      code: 204,
      data: {
        _id,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function signupUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const registrationUser = await User.findOne({ email });
    if (registrationUser) {
      throw new Conflict(`User with ${email} in use`);
    }

    const newUser = new User({ name, email });
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

async function updateSubscriptionUser(req, res, next) {
  try {
    const { _id, name, email, createdAt, updatedAt } = req.user;
    const { subscription } = req.body;
    const result = await User.findByIdAndUpdate(
      _id,
      { subscription },
      { new: true }
    );
    if (!result) {
      throw new NotFound(`subscription with id=${_id} not found!`);
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        user: {
          name,
          email,
          subscription,
          createdAt,
          updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
async function googleAuth(_req, res) {
  const fieldParams = queryString.stringyfy({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}:${PORT}/users/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(""),
    response_type: "code",
    access_type: "offline",
    promt: "consent",
  });
  return res.redirect(
    `https://account.google.com/o/oauth2/v2/auth?${fieldParams}`
  );
}

async function googleRedirect(req, res) {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}:${PORT}/users/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  // логика для регистрации

  return res.redirect(`${FRONTEND_URL}?email=${userData.data.email}`);
}

module.exports = {
  currentUser,
  loginUser,
  logoutUser,
  signupUser,
  updateSubscriptionUser,
  googleAuth,
  googleRedirect,
};
