module.exports = {
  up: (pgm) => {
    pgm.createTable("passport", {
      id: { type: "serial", primaryKey: true },
      series: { type: "integer", notNULL: true },
      number: { type: "integer", notNULL: true },
      date_issue: { type: "date", notNULL: true },
      unit_kod: { type: "integer", notNULL: true },
      issued_by_whom: { type: "varchar(100)", notNULL: true },
    });
  },

  down: (pgm) => {
    pgm.dropTable("passport");
  },
};
