import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "../config/passport.js";

export const globalmiddleware = [
  express.json(), //app.use(express.json()), aap mein esse likhnege agar direct use karoge to.
  cookieParser(), //   app.use(cookieParser()),
  passport.initialize(), //   app.use(passport.initialize()),
  morgan("dev"), //   app.use(morgan("dev")),
];
