module.exports = {
  up: (pgm) => {
    pgm.createTable("role", {
      id: { type: "serial", primaryKey: true },
      role: { type: "varchar(25)", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("role");
  },
};
