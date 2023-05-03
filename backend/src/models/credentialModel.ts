import { Model } from "objection";
import userModel from "./userModel";

export default class credentialModel extends Model {
  id!: number;
  user_ref!: number;
  content!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "credentials";
  }
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  //JSON schema used for input validations
  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        id: { type: "integer" },
        user_ref: { type: "integer" }, //reference to the user
        content: { type: "string", maxLength: 1024 }, //The contents of this row are encrypted thus the max length 1024
        created_at: { type: "string" }, //timestamp
        updated_at: { type: "string" } //timestamp
      }
    };
  }

  //Relation mappings to other models
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: userModel,
        join: {
          from: "credentials.user_ref",
          to: "users.id"
        }
      }
    };
  }
}
