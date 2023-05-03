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

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  //JSON schema used for validations
  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "password"],

      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 5, maxLength: 32 }, //Username
        password: { type: "string", minLength: 1, maxLength: 255 }, //hash (pwhash+salt+vaultKeySalt), maxLength = default max length of psql row content
        created_at: { type: "string" }, //Timestamp
        updated_at: { type: "string" } //timestamp
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
