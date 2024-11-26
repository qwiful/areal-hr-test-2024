module.exports = {
  up: (pgm) => {
    pgm.createTable("adress", {
      id: { type: "serial", primaryKey: true },
      region: { type: "varchar(50)", notNULL: true },
      locality: { type: "varchar(50)", notNULL: true },
      street: { type: "varchar(50)", notNULL: true },
      house: { type: "varchar(10)", notNULL: true },
      building: { type: "varchar(10)", notNULL: false },
      apartment: { type: "integer", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("adress");
  },
};
