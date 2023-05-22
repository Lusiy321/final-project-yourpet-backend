const { User } = require("../model/model");
const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const KEY = process.env.SECRET_KEY;

async function userAuth(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, KEY);
    const userAuthorizationById = await User.findById(id);
    if (!userAuthorizationById || !userAuthorizationById.token) {
      throw new Unauthorized("Not authorized");
    }
    req.user = userAuthorizationById;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      error.status = 401;
    }
    next(error);
  }
}

function validation(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      next(error);
      return;
    }
    next();
  };
}
module.exports = { userAuth, validation };
