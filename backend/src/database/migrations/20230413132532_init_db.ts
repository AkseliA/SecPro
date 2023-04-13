import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("users")
    .createTable("users", table => {
      table.increments("id").primary();
      table.string("username").unique().notNullable();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .dropTableIfExists("credentials")
    .createTable("credentials", table => {
      table.increments("id").primary();
      table.integer("user_ref").unsigned().notNullable;
      table.foreign("user_ref").references("users.id").onDelete("CASCADE");
      table.string("website").notNullable();
      table.string("username").notNullable();
      table.text("password").notNullable();
      table.text("notes");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users").dropTable("credentials");
}
