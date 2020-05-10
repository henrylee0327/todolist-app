const createListQuery = `
CREATE TABLE list (
	id serial primary key,
	uuid text unique,
	name text unique,
	ctime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropListTableQuery = `DROP TABLE list;`

exports.up = function(knex) {
  return knex.raw(createListQuery)
};

exports.down = function(knex) {
  return knex.raw(dropListTableQuery)
};
