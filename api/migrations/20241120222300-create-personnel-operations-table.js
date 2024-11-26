module.exports = {
  up: (pgm) => {
    pgm.createTable("personnel_operations", {
      id: { type: "serial", primaryKey: true },
      id_worker: { type: "integer", notNULL: true },
      id_department: { type: "integer", notNULL: true },
      id_position: { type: "integer", notNULL: true },
      setting_salary: { type: "integer", notNULL: true },
      salary_change: { type: "integer", notNULL: false },
      department_change: { type: "varchar(50)", notNULL: false },
      delite_worker: { type: "boolean", notNULL: true },
    });
    pgm.addConstraint("personnel_operations", "fk_worker", {
      foreignKeys: {
        columns: "id_worker",
        references: "workers(id)",
        onDelete: "CASCADE",
      },
    });
    pgm.addConstraint("personnel_operations", "fk_departments", {
      foreignKeys: {
        columns: "id_department",
        references: "departments(id)",
        onDelete: "CASCADE",
      },
    });
    pgm.addConstraint("personnel_operations", "fk_position", {
      foreignKeys: {
        columns: "id_position",
        references: "positions(id)",
        onDelete: "CASCADE",
      },
    });
  },

  down: (pgm) => {
    pgm.dropTable("personnel_operations");
  },
};
