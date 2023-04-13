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
        const pwHash = await bcrypt.hash(req.body.password, salt);

        //Store user
        const insert = await userModel
          .query()
          .insert({ username: username, password: pwHash });
        res.json(insert);

        //User does exit -> return
      } else {
        res.status(400).json("Username in use");
      }
    } catch (err) {
      res.status(500).json("Error registering user");
    }

    next();
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    //parse and validate request body
    const user = req.body;

    const userCandidate = await userModel
      .query()
      .findOne({ username: user.username });
    if (!userCandidate) {
      return res.json({ msg: "Login failed: invalid credentials." });
    }
    const isValidPassword = await bcrypt.compare(
      user.password,
      userCandidate.password
    );
    if (!isValidPassword) {
      return res.json({ msg: "Login failed: invalid credentials." });
    }

    //Create jwt and return token
    const jwtPayload = {
      id: userCandidate.id,
      username: userCandidate.username
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: 60 * 60
    });
    res.json({ user: userCandidate, token: token });
    next();
  }

  public async protectTest(req: Request, res: Response, next: NextFunction) {
    res.json({ msg: "läpi" });
    next();
  }
}

export default new UserController();
