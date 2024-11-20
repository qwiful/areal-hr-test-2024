module.exports = {
  up: (pgm) => {
    pgm.createTable("departments", {
      id: { type: "serial", primaryKey: true },
      id_organization: { type: "integer", notNULL: true },
      name: { type: "varchar(50)", notNULL: true },
      id_parent: { type: "integer", notNULL: true },
      comment: { type: "varchar(250)", notNULL: true },
    });
    pgm.addConstraint("departments", "fk_parent", {
      foreignKeys: {
        columns: "id_parent",
        references: "departments(id)",
        onDelete: "CASCADE",
      },
    });
    pgm.addConstraint("departments", "fk_organization", {
      foreignKeys: {
        columns: "id_organization",
        references: "organizations(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("departments");
  },
};
