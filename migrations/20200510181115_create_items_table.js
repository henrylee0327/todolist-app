const createListItemsQuery = `
CREATE TABLE list_items (
	id serial primary key,
    uuid text unique,
    description text,
    display_order int,
    list_id integer references list(id),
	ctime timestamptz,
	mtime timestamptz default current_timestamp
);`

const dropListItemsQuery = `DROP TABLE list_items;`

exports.up = function(knex) {
  return knex.raw(createListItemsQuery)
};

exports.down = function(knex) {
  return knex.raw(dropListItemsQuery)
};
