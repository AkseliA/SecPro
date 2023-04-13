import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportJwt from "passport-jwt";
import * as dotenv from "dotenv";
import userModel from "../models/userModel";

dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const strategyParameters = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

function verifyCallback(jwtPayload, done) {
  return done(null, jwtPayload as userModel);
}

const defaultStrategy = new JwtStrategy(strategyParameters, verifyCallback);

class AuthController {
  constructor() {
    passport.use(defaultStrategy);
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
  }

  public authenticateJwt(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ msg: "Failed to authenticate token" });
      }
      if (!user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      req.user = user;
      next();
    })(req, res, next);
  }
}

export default new AuthController();
