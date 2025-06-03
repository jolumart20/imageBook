import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import  User  from "../models/user.js";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Search an existing email
      const userFound = await User.findOne({ email });

      // return an error if the email already exists
      if (userFound) {
        return done(null, false, { message: "Usuario Existente" });
      }

      // create a new User
      const newUser = new User();
      newUser.email = email;
      newUser.password = await User.encryptPassword(password);
      const userSaved = await newUser.save();

      // create a success message
      req.flash("success", "Ingresa con tu nueva cuenta");

      // return the session
      return done(null, userSaved);
    }
  )
);

passport.use(
  "signin",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
    },
    async (email, password, done) => {
      // Find the user by email
      const userFound = await User.findOne({ email });

      // if user does not exists
      if (!userFound) return done(null, false, { message: "Usuario no Encontrado" });

      // match password
      const match = await userFound.matchPassword(password);
      
      if (!match) return done(null, false, { message: "Contraseña Incorrecta" });

      const token = jwt.sign({ userId: userFound._id, userEmail: userFound.email }, 
                          'secreto', { expiresIn: '8h' });
        console.log(userFound);
      return done(null, userFound);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findById(id)).toObject();
    // delete the user from object respones
    if (user) {
      delete user.password;
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
