module.exports = {
  up: (pgm) => {
    pgm.createTable("positions", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
      is_deleted: { type: "boolean", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("positions");
  },
};
