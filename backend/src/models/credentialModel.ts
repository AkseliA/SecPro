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
  async $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  //JSON schema used for input validations
  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        id: { type: "integer" },
        user_ref: { type: "integer" },
        content: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" }
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
