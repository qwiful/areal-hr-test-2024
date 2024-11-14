const Joi = require("joi");

const positionsSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
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
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getPositions: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM positions");
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
          "SELECT * FROM positions WHERE id = $1",
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
        const result = await pool.query(
          "UPDATE positions SET name = $1 WHERE id = $2 RETURNING *",
          [name, id]
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

    deletePosition: async (req, res) => {
      const { error } = positionsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM positions WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Должность удалена" });
        } else {
          res.status(404).json({ message: "Должность не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
