import { Request, Response, NextFunction } from "express";
import credentialModel from "../models/credentialModel";

class CredentialController {
  public async addCredential(req: Request, res: Response, next: NextFunction) {
    try {
      //Store credential
      const insert = await credentialModel
        .query()
        //@ts-ignore
        .insert({ user_ref: req.user.id, content: req.body.credential })
        .returning("*");

      res.json(insert);
    } catch (err) {
      res.status(500).json({ msg: "Error adding credential" });
    }
    next();
  }

  public async updateCredential(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const id = req.body.id;

      //Get the credential with the supplied id (in req.body)
      //Also check that the user is the owner of the credential.
      const credential = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", id);

      if (!credential) {
        return res.json(404).json({ msg: "Error updating credential" });
      }

      // Update credential
      const insert = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", id)
        .update({ content: req.body.credential })
        .returning("*");

      res.json(insert);
    } catch (err) {
      res.status(500).json({ msg: "Error updating credential" });
    }
    next();
  }
  public async deleteCredential(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const credentialId = req.params.id;

      const deleted = await credentialModel
        .query()
        .delete()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", credentialId);

      //Returns an integer that indicates affected rows.
      res.json(deleted);
    } catch (err) {
      res.status(500).json("Error deleting credentials");
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
