import express, { Express } from "express";
import knex from "knex";
import dotenv from "dotenv";
import { config } from "./database/knexfile";
import { Server } from "http";
import userRouter from "./routers/userRouter";
import credentialsRouter from "./routers/credentialRouter";
import bodyParser from "body-parser";
import { Model } from "objection";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
let server: Server;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/credentials", credentialsRouter);

const startServer = async () => {
  Model.knex(knex(config.development));
  const migrationDir = `${__dirname}/database/migrations`;
  console.log(`Migrating to latest using directory: ${migrationDir}`);
  await knex(config.development).migrate.latest({ directory: migrationDir });

  server = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
};

const shutDownServer = () => {
  server.close();
  console.log("Server shutting down");
  process.exit(0);
};

void startServer();

process.on("SIGTERM", shutDownServer);
process.on("SIGINT", shutDownServer);
