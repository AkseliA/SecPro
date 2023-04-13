import { Model } from "objection";
import userModel from "./userModel";

export default class credentialModel extends Model {
  id!: number;
  user_ref!: number;
  website!: string;
  username!: string;
  password!: string;
  notes?: string;
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
      required: ["user_ref", "website", "username", "password"],

      properties: {
        id: { type: "integer" },
        user_ref: { type: "integer" },
        website: { type: "string", minLength: 1, maxLength: 255 },
        username: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 1 },
        notes: { type: "string", minLength: 0, maxLength: 255 },
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
