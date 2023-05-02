import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("credentials", table => {
    table.string("content", 1024).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("credentials", table => {
    table.string("content", 255).alter();
  });
}
