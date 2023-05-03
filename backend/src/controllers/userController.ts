import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

//https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
/**@TODO error handling */

class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      //parse request body
      const username = req.body.username;
      //Check if user with same username exists
      const doesUserExist = await userModel.query().findOne({ username });
      //User does not exist -> continue registering
      if (!doesUserExist) {
        //Create password salt and hash usign bcrypt
        const salt = bcrypt.genSaltSync(10);
        let pwHash = await bcrypt.hash(req.body.password, salt);

        /**
         * Generate another salt, which is used when deriving vault key using pbkdf2 (client side).
         * The salt used for deriving vault key is appended to the password. Length is fixed 29 characters.
         * The "extra" salt must be extracted from the password when checking if it matches (in login).
         */
        const vaultKeySalt = bcrypt.genSaltSync(10);
        pwHash += vaultKeySalt;

        //Store user
        const insert = await userModel
          .query()
          .insert({ username: username, password: pwHash });
        res.json(insert);

        //User does exit -> return
      } else {
        res.status(403).json("Error registering user");
      }
    } catch (err) {
      res.status(500).json("Error registering user");
    }

    next();
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      //parse and validate request body
      const user = req.body;

      const userCandidate = await userModel
        .query()
        .findOne({ username: user.username });
      if (!userCandidate) {
        return res
          .status(401)
          .json({ msg: "Login failed: invalid credentials." });
      }

      //Remove vaultKeyHash from the latter part of password.
      const passwordHash = userCandidate.password.slice(0, -29);
      const isValidPassword = await bcrypt.compare(user.password, passwordHash);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ msg: "Login failed: invalid credentials." });
      }

      //Create jwt and return token
      const jwtPayload = {
        id: userCandidate.id,
        username: userCandidate.username,
        pwhash: userCandidate.password
      };

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: 60 * 60
      });

      res.json({
        accessToken: token,
        id: userCandidate.id,
        username: userCandidate.username,
        passwordHash: userCandidate.password
      });
    } catch (err) {
      res.status(500).json("Error logging user");
    }
    next();
  }
}

export default new UserController();
