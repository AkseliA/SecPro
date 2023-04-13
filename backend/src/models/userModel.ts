import { Model } from "objection";
import credentialModel from "./credentialModel";

export default class userModel extends Model {
  id!: number;
  username!: string;
  password!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return "users";
  }
  async $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  //JSON schema used for validations
  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "password"],

      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 1 },
        created_at: { type: "string" },
        updated_at: { type: "string" }
      }
    };
  }
  //Relation mappings to other models
  static get relationMappings() {
    return {
      credentials: {
        relation: Model.HasManyRelation,
        modelClass: credentialModel,
        join: {
          from: "users.id",
          to: "credentials.user_ref"
        }
      }
    };
  }
}
