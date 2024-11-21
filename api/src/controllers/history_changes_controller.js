const Joi = require("joi");

const changesIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    getChanges: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM history_changes");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getChangeById: async (req, res) => {
      const { error } = changesIdSchema.validate(req.params);
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
  };
};
