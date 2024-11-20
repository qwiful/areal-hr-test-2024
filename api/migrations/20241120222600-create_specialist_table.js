module.exports = {
  up: (pgm) => {
    pgm.createTable("specialist", {
      id: { type: "serial", primaryKey: true },
      surname: { type: "varchar(50)", notNULL: true },
      name: { type: "varchar(50)", notNULL: true },
      patronymic: { type: "varchar(50)", notNULL: false },
      id_avtorization: { type: "integer", notNULL: true },
      id_role: { type: "integer", notNULL: true },
    });
    pgm.addConstraint("specialist", "fk_avtorization", {
      foreignKeys: {
        columns: "id_avtorization",
        references: "avtorization(id)",
        onDelete: "CASCADE",
      },
    });
    pgm.addConstraint("specialist", "fk_role", {
      foreignKeys: {
        columns: "id_role",
        references: "role(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("specialist");
  },
};
