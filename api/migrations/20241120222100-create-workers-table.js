module.exports = {
  up: (pgm) => {
    pgm.createTable("workers", {
      id: { type: "serial", primaryKey: true },
      surname: { type: "varchar(50)", notNULL: true },
      name: { type: "varchar(50)", notNULL: true },
      patronymic: { type: "varchar(50)", notNULL: false },
      date_of_birth: { type: "date", notNULL: true },
      id_passport: { type: "integer", notNULL: true },
      id_adress: { type: "integer", notNULL: true },
      is_deleted: { type: "boolean", notNULL: true },
    });
    pgm.addConstraint("workers", "fk_passport", {
      foreignKeys: {
        columns: "id_passport",
        references: "passport(id)",
        onDelete: "CASCADE",
      },
    });
    pgm.addConstraint("workers", "fk_adress", {
      foreignKeys: {
        columns: "id_adress",
        references: "adress(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("workers");
  },
};
