const Joi = require("joi");

const departmentSchema = Joi.object({
  id_organization: Joi.number().integer().required(),
  name: Joi.string().min(1).max(50).required(),
  id_parent: Joi.number().integer().required(),
  comment: Joi.string().max(250).required(),
});

const departmentIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createDepartment: async (req, res) => {
      const { error } = departmentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id_organization, name, id_parent, comment } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO departments (id_organization, name, id_parent, comment) VALUES ($1, $2, $3, $4) RETURNING *",
          [id_organization, name, id_parent, comment]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Отдел", JSON.stringify(result.rows[0])]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getDepartments: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM departments");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getDepartmentById: async (req, res) => {
      const { error } = departmentIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM departments WHERE id = $1",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Отдел не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateDepartment: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = departmentIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = departmentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id_organization, name, id_parent, comment } = req.body;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM departments WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Отдел не найден" });
        }
        const oldData = currentResult.rows[0];
        const result = await pool.query(
          "UPDATE departments SET id_organization = $1, name = $2, id_parent = $3, comment = $4 WHERE id = $5 RETURNING *",
          [id_organization, name, id_parent, comment, id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [
            req.user.id,
            "Отдел",
            JSON.stringify({ old: oldData, new: result.rows[0] }),
          ]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteDepartment: async (req, res) => {
      const { error } = departmentIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const currentResult = await pool.query(
          "SELECT  FROM departments WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Отдел не найден" });
        }
        const result = await pool.query(
          "DELETE FROM departments WHERE id = $1 RETURNING *",
          [id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Отдел", JSON.stringify(result.rows[0])]
        );
        res.json({ message: "Отдел удален" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
