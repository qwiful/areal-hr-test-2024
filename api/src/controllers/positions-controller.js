const Joi = require("joi");

const positionsSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  is_deleted: Joi.boolean().required(),
});

const positionsIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createPosition: async (req, res) => {
      const { error } = positionsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO positions (name) VALUES ($1) RETURNING *",
          [name]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Должность", JSON.stringify(result.rows[0])]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getPositions: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM positions WHERE is_deleted = FALSE");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getPositionById: async (req, res) => {
      const { error } = positionsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM positions WHERE id = $1 AND is_deleted = FALSE",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Должность не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updatePosition: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = positionsIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = positionsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name } = req.body;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM positions WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Должность не найдена" });
        }
        const oldData = currentResult.rows[0];
        const result = await pool.query(
          "UPDATE positions SET name = $1 WHERE id = $2 RETURNING *",
          [name, id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [
            req.user.id,
            "Должность",
            JSON.stringify({ old: oldData, new: result.rows[0] }),
          ]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deletePosition: async (req, res) => {
      const { error } = positionsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM positions WHERE id = $1 AND is_deleted = FALSE",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Должность не найдена" });
        }
        const result = await pool.query(
          "UPDATE positions SET is_deleted = TRUE WHERE id = $1",
          [id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Должность", JSON.stringify(result.rows[0])]
        );
        res.json({ message: "Должность удалена" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
