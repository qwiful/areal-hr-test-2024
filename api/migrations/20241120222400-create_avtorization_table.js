module.exports = {
  up: (pgm) => {
    pgm.createTable("avtorization", {
      id: { type: "serial", primaryKey: true },
      login: { type: "varchar(50)", notNULL: true },
      password: { type: "varchar(50)", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("avtorization");
  },
};
