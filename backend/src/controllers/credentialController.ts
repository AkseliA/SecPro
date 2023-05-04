import { Request, Response, NextFunction } from "express";
import credentialModel from "../models/credentialModel";

class CredentialController {
  public async addCredential(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req?.user;
      const credentialToStore = req.body.credential;

      //Store credential and return stored credential
      const insert = await credentialModel
        .query()
        //@ts-ignore
        .insert({ user_ref: user.id, content: credentialToStore })
        .returning("*");

      //Return stored credential
      res.status(200).json(insert);
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
      const user = req?.user;
      const credentialId = req.body.id;
      const updatedCredential = req.body.credential;

      //If credentialId or updatedCredential is not found, throw error
      if (!credentialId || !updatedCredential) {
        throw new Error();
      }

      //Get the credential with the supplied id (in req.body)
      //Also check that the user is the owner of the credential (where clause).
      const credential = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", credentialId);

      if (!credential) {
        throw new Error();
      }

      // Update and return updated credential.
      const insert = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", credentialId)
        .update({ content: updatedCredential })
        .returning("*");

      //Return updated credential
      res.json(insert);
    } catch (err) {
      res.status(500).json("Error updating credential");
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

      //Delete the credential, returns an integer that indicated affected rows.
      const deleted = await credentialModel
        .query()
        .delete()
        //@ts-ignore
        .where("user_ref", user.id)
        .andWhere("id", credentialId);

      //Return the integer (affected rows)
      res.json(deleted);
    } catch (err) {
      res.status(500).json("Error deleting credentials");
    }
    next();
  }

  public async getCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      //Get all credentials of the user. If no credentials are found, return empty array.
      const credentials = await credentialModel
        .query()
        //@ts-ignore
        .where("user_ref", user.id);

      res.json({ credentials: credentials });
    } catch (err) {
      res.status(500).json("Error getting credentials");
    }
    next();
  }
}

export default new CredentialController();
