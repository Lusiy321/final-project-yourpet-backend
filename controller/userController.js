const { Unauthorized, Conflict, NotFound } = require("http-errors");
const { User } = require("../service/schemas/schemas");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "sadasdasdasdsa";

async function currentUser(req, res, next) {
  try {
    const { name, email, subscription } = req.user;
    res.json({
      status: "success",
      code: 200,
      data: {
        user: {
          name,
          email,
          subscription,
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

module.exports = {
  currentUser,
  loginUser,
  logoutUser,
  signupUser,
  updateSubscriptionUser,
};
