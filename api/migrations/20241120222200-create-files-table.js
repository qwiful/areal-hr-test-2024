module.exports = {
  up: (pgm) => {
    pgm.createTable("files", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
      file: { type: "varchar(100)", notNULL: true },
      id_worker: { type: "integer", notNULL: true },
      is_deleted: { type: "boolean", notNULL: true },
    });
    pgm.addConstraint("files", "fk_skan", {
      foreignKeys: {
        columns: "id_worker",
        references: "workers(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("files");
  },
};
