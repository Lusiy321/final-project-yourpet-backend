const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const usrRouter = require("./routes/api/usrRouter");
const postRouter = require("./routes/api/postRouter");
const petRouter = require("./routes/api/petRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const passport = require("passport");
const session = require("express-session");

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(
  session({
    secret: `${SECRET_KEY}`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/posts", postRouter);
app.use("/users", usrRouter);
app.use("/pet", petRouter);
app.use("/friends", express.static("public"));

app.get("/", async (req, res) => {
  console.log(req.body);
  res.status(200).json("Server started");
});

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIR_URL = process.env.REDIR_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: `${GOOGLE_CLIENT_ID}`,
      clientSecret: `${GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${REDIR_URL}`,
    },
    (accessToken, refreshToken, profile, done) => {
      // В этой функции вы можете выполнить дополнительную логику, связанную с авторизацией через Google,
      // например, проверить, есть ли пользователь в вашей базе данных или создать новую запись пользователя.
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
      };
      done(null, user);
    }
  )
);

async function startApp() {
  try {
    mongoose.connect(DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () =>
      console.log(`Server running. Use our API on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(`Server not running. Error message: ${e}`);
  }
}
startApp();
