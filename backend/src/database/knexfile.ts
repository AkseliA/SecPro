import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST
    },
    migrations: {
      directory: "./migrations"
    }
  }
};
