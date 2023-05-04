import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

//https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      //parse request body
      const username = req.body.username;
      if (!username || !isValidUsername(username)) {
        throw new Error();
      }

      const password = req.body.password;
      if (!password || !isValidPassword(password)) {
        throw new Error();
      }

      //Check if user with same username exists
      const doesUserExist = await userModel.query().findOne({ username });

      //User does not exist -> continue registering
      if (!doesUserExist) {
        //Create password salt and hash usign bcrypt
        const salt = bcrypt.genSaltSync(10);
        let pwHash = await bcrypt.hash(password, salt);

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
      const password = req.body?.password;
      const username = req.body?.username;
      if (!username || !password || !isValidUsername(username)) {
        throw new Error();
      }

      const userCandidate = await userModel
        .query()
        .findOne({ username: username });
      if (!userCandidate) {
        return res.status(401).json("Login failed: invalid credentials.");
      }

      //Remove vaultKeyHash from the latter part of password.
      const passwordHash = userCandidate.password.slice(0, -29);
      const isValidPassword = await bcrypt.compare(password, passwordHash);

      if (!isValidPassword) {
        return res.status(401).json("Login failed: invalid credentials.");
      }

      //Create jwt and return token
      const jwtPayload = {
        id: userCandidate.id
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
      res.status(500).json("Error logging in");
    }
    next();
  }
}

/**
 * Function to validate that password meets min requirements when registering an user
 * bcrypt allows only 72 bytes of data in the hashing, so password is limited to 64 characters to be on the safe side.
 * Since password is stored as hash ( > 64chars) also the plaintext password length must be checked before proceeding
 *
 * Requirements (https://pages.nist.gov/800-63-3/sp800-63b.html Appendix A - A.1):
 *  - length 8 - 64 characters
 *  - atleast 1 x digit
 *  - atleast 1 x special character
 *  - atleast 1 x uppercase and lowercase letters
 *
 * @param password
 * @returns boolean - indicates if is valid (true) or not valid (false)
 */

const isValidPassword = (password: string): boolean => {
  //Length requirement
  if (password?.length < 8 || password?.length > 64) {
    console.log("length");
    return false;
  }
  //Regex for checking that password has atleast 1x digit, symbol, upper&lowercase characters
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!regex.test(password)) {
    console.log("regex");
    return false;
  }

  return true;
};

/**
 * Function for checking that the username supplied (in registration) is valid.
 * When storing the username in database, additional validation is done against defined jsonSchema (in userModel)
 * Requirements:
 *  - Length between 5 - 32 characters
 *
 * @param username
 * @returns boolean - indicates if is valid (true) or not valid (false)
 */
const isValidUsername = (username: string): boolean => {
  const trimmed = username.trim(); //remove whitespaces
  if (trimmed?.length < 5 || trimmed?.length > 32) {
    return false;
  }
  return true;
};
export default new UserController();
