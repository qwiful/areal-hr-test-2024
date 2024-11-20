module.exports = {
  up: (pgm) => {
    pgm.createTable("history_changes", {
      id: { type: "serial", primaryKey: true },
      date_time_operation: { type: "timestamp", default: pgm.func("NOW()") },
      who_changed: { type: "integer", notNULL: true },
      object: { type: "varchar(100)", notNULL: true },
      changed_field: { type: "json", notNULL: true },
    });
    pgm.addConstraint("history_changes", "fk_specialist", {
      foreignKeys: {
        columns: "who_changed",
        references: "specialist(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("history_changes");
  },
};
