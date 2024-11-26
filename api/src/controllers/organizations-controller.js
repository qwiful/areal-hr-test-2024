const Joi = require("joi");

const organizationsSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  comment: Joi.string().max(250).required(),
  is_deleted: Joi.boolean().required(),
});

const organizationsIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createOrganization: async (req, res) => {
      const { error } = organizationsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name, comment } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *",
          [name, comment]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Организация", JSON.stringify(result.rows[0])]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOrganizations: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM organizations WHERE is_deleted = FALSE");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOrganizationById: async (req, res) => {
      const { error } = organizationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM organizations WHERE id = $1 AND is_deleted = FALSE",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Организация не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateOrganization: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = organizationsIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = organizationsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name, comment } = req.body;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM organizations WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Организация не найдена" });
        }
        const oldData = currentResult.rows[0];
        const result = await pool.query(
          "UPDATE organizations SET name = $1, comment = $2 WHERE id = $3 RETURNING *",
          [name, comment, id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [
            req.user.id,
            "Организация",
            JSON.stringify({ old: oldData, new: result.rows[0] }),
          ]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteOrganization: async (req, res) => {
      const { error } = organizationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM organizations WHERE id = $1 AND is_deleted = FALSE",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Организация не найдена" });
        }
        const result = await pool.query(
          "UPDATE organizations SET is_deleted = TRUE WHERE id = $1",
          [id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Организация", JSON.stringify(result.rows[0])]
        );
        res.json({ message: "Организация удалена" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
