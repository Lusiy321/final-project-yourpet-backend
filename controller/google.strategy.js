const passport = require("passport");
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
        accessToken: accessToken,
      };
      done(null, user);
    }
  )
);
