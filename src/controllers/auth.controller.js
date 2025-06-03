import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { token } from "morgan";
import cookieParser from "cookie-parser";

export const renderSignUp = (req, res) => {
  res.render("authentication/signup", {
    layout: "nostats",
  });
};

export const renderSignIn = (req, res) => {
  res.render("authentication/signin", {
    layout: "nostats",
  });
};

export const signUp = passport.authenticate("signup", {
  successRedirect: "/",
  failureRedirect: "/auth/signup",
  failureFlash: true,
});

// export const signIn = passport.authenticate("signin", {
//   successRedirect: "/",
//   failureRedirect: "/auth/signin",
//   failureFlash: true,
  
// });

export let tok;

export const signIn = (req, res, next) => {
  passport.authenticate("signin", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Si la autenticación falla
      return res.redirect("/");
    }
    // Si la autenticación es exitosa, inicia sesión
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Genera el token JWT
      tok = jwt.sign(
        { userId: user._id, userEmail: user.email },
        "secreto", // Cambia esto por una variable de entorno en producción
        { expiresIn: "8h" }
      );
      // Puedes enviar el token como JSON o guardarlo en una cookie
      // Ejemplo: enviar como JSON
      // return res.json({ token, user });
      
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   maxAge: 8 * 60 * 60 * 1000 // 8 horas
      // });
      
      // O redirigir si prefieres mantener el flujo clásico:
      return res.redirect("/index");
    });
  })(req, res, next);
};



export const profile = (req, res) => {
  res.render("authentication/profile");
  
};

export const logout = (req, res) => {
  req.logout();
  tok = null; // Limpiar el token
  res.redirect("/");
};
