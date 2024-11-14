const Joi = require("joi");

const changesSchema = Joi.object({
  date_time_operation: Joi.date().required(),
  who_changed: Joi.number().integer().required(),
  object: Joi.string().min(1).max(100).required(),
  changed_field: Joi.object().optional().required(),
});

const changesIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createChange: async (req, res) => {
      const { error } = changesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { who_changed, object, changed_field } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO history_changes (who_changed, object, changed_field) VALUES ($1, $2, $3) RETURNING *",
          [who_changed, object, changed_field]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getChanges: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM history_changes");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getChangeById: async (req, res) => {
      const { error } = changesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM history_changes WHERE id = $1",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Изменение не найдено" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateChange: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = changesIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = changesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { who_changed, object, changed_field } = req.body;
      try {
        const result = await pool.query(
          "UPDATE history_changes SET who_changed = $1, object = $2, changed_field = $3 WHERE id = $4 RETURNING *",
          [who_changed, object, changed_field, id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Изменение не найдено" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteChange: async (req, res) => {
      const { error } = changesIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM history_changes WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Изменение удалено" });
        } else {
          res.status(404).json({ message: "Изменение не найдено" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
