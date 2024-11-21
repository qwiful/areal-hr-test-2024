const Joi = require("joi");

const operationsSchema = Joi.object({
  id_worker: Joi.number().integer().required(),
  id_department: Joi.number().integer().required(),
  id_position: Joi.number().integer().required(),
  setting_salary: Joi.number().integer().required(),
  salary_change: Joi.number().integer().optional(),
  department_change: Joi.string().min(1).max(50).optional(),
  delite_worker: Joi.boolean().required(),
});

const operationsIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createOperation: async (req, res) => {
      const { error } = operationsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const {
        id_worker,
        id_department,
        id_position,
        setting_salary,
        salary_change,
        department_change,
        delite_worker,
      } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO personnel_operations (id_worker, id_department, id_position, setting_salary, salary_change, department_change, delite_worker) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [
            id_worker,
            id_department,
            id_position,
            setting_salary,
            salary_change,
            department_change,
            delite_worker,
          ]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Кадровая операция", JSON.stringify(result.rows[0])]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOperations: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM personnel_operations");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOperationById: async (req, res) => {
      const { error } = operationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM personnel_operations WHERE id = $1",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Операция не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateOperation: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = operationsIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = operationsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const {
        id_worker,
        id_department,
        id_position,
        setting_salary,
        salary_change,
        department_change,
        delite_worker,
      } = req.body;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM personnel_operations WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Операция не найдена" });
        }
        const oldData = currentResult.rows[0];
        const result = await pool.query(
          "UPDATE personnel_operations SET id_worker = $1, id_department = $2, id_position = $3, setting_salary = $4, salary_change = $5, department_change = $6, delite_worker = $7 WHERE id = $8 RETURNING *",
          [
            id_worker,
            id_department,
            id_position,
            setting_salary,
            salary_change,
            department_change,
            delite_worker,
            id,
          ]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [
            req.user.id,
            "Кадровая операция",
            JSON.stringify({ old: oldData, new: result.rows[0] }),
          ]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteOperation: async (req, res) => {
      const { error } = operationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM personnel_operations WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Операция не найдена" });
        }
        const result = await pool.query(
          "DELETE FROM personnel_operations WHERE id = $1 RETURNING *",
          [id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Кадровая операция", JSON.stringify(result.rows[0])]
        );
        res.json({ message: "Операция удалена" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
