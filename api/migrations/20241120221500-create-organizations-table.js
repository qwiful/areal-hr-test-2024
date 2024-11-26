module.exports = {
  up: (pgm) => {
    pgm.createTable("organizations", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
      comment: { type: "varchar(250)", notNULL: true },
      is_deleted: { type: "boolean", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("organizations");
  },
};
