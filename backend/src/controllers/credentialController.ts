import { Request, Response, NextFunction } from "express";
import credentialModel from "../models/credentialModel";

class CredentialController {
  public async addCredential(req: Request, res: Response, next: NextFunction) {
    try {
      const newCredentials = req.body;
      //@ts-ignore
      newCredentials.user_ref = req.user.id;
      //Store credential
      const insert = await credentialModel.query().insert(newCredentials);
      res.json(insert);
    } catch (err) {
      res.status(500).json("Error adding credential");
    }
    next();
  }
  public async getCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const credentials = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id);
      if (!credentials) {
        return res.json(404).json({ msg: "Error getting credentials" });
      }
      res.json({ credentials: credentials });
    } catch (err) {
      res.status(500).json("Error getting credentials");
    }
    next();
  }
}

export default new CredentialController();
