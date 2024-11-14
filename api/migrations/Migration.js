const { addConstraint } = require("node-pg-migrate");

module.exports = {
  up: (pgm) => {
    pgm.createTable("organizations", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
      comment: { type: "varchar(250)", notNULL: true },
    });

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

    pgm.createTable("positions", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
    });

    pgm.createTable("passport", {
      id: { type: "serial", primaryKey: true },
      series: { type: "integer", notNULL: true },
      number: { type: "integer", notNULL: true },
      date_issue: { type: "date", notNULL: true },
      unit_kod: { type: "integer", notNULL: true },
      issued_by_whom: { type: "varchar(100)", notNULL: true },
    });

    pgm.createTable("adress", {
      id: { type: "serial", primaryKey: true },
      region: { type: "varchar(50)", notNULL: true },
      locality: { type: "varchar(50)", notNULL: true },
      street: { type: "varchar(50)", notNULL: true },
      house: { type: "varchar(10)", notNULL: true },
      building: { type: "varchar(10)", notNULL: false },
      apartment: { type: "integer", notNULL: true },
    });

    pgm.createTable("workers", {
      id: { type: "serial", primaryKey: true },
      surname: { type: "varchar(50)", notNULL: true },
      name: { type: "varchar(50)", notNULL: true },
      patronymic: { type: "varchar(50)", notNULL: false },
      date_of_birth: { type: "date", notNULL: true },
      id_passport: { type: "integer", notNULL: true },
      id_adress: { type: "integer", notNULL: true },
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

    pgm.createTable("files", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(50)", notNULL: true },
      file: { type: "varchar(100)", notNULL: true },
      id_worker: { type: "integer", notNULL: true },
    });
    pgm.addConstraint("files", "fk_skan", {
      foreignKeys: {
        columns: "id_worker",
        references: "workers(id)",
        onDelete: "CASCADE",
      },
    });

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

    pgm.createTable("avtorization", {
      id: { type: "serial", primaryKey: true },
      login: { type: "varchar(50)", notNULL: true },
      password: { type: "varchar(50)", notNULL: true },
    });

    pgm.createTable("role", {
      id: { type: "serial", primaryKey: true },
      role: { type: "varchar(25)", notNULL: true },
    });

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

    pgm.createTable("history_changes", {
      id: { type: "serial", primaryKey: true },
      date_time_operation: { type: "timestamp", default: pgm.func("NOW()") },
      who_changed: { type: "integer", notNULL: true },
      object: { type: "varchar", notNULL: true },
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
    pgm.dropTable("organizations");
    pgm.dropTable("departments");
    pgm.dropTable("positions");
    pgm.dropTable("passport");
    pgm.dropTable("files");
    pgm.dropTable("adress");
    pgm.dropTable("workers");
    pgm.dropTable("personnel_operations");
    pgm.dropTable("avtorization");
    pgm.dropTable("role");
    pgm.dropTable("specialist");
    pgm.dropTable("history_changes");
  },
};
