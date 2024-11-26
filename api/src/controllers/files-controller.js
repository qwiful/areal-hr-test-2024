const Joi = require("joi");

const filesSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  file: Joi.string().min(1).max(100).required(),
  id_worker: Joi.number().integer().required(),
  is_deleted: Joi.boolean().required(),
});

const filesIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createFile: async (req, res) => {
      const { error } = filesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name, file, id_worker } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO files (name, file, id_worker) VALUES ($1, $2, $3) RETURNING *",
          [name, file, id_worker]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getFiles: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM files WHERE is_deleted = FALSE");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getFileById: async (req, res) => {
      const { error } = filesIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query("SELECT * FROM files WHERE id = $1 AND is_deleted = FALSE", [
          id,
        ]);
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Файл не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateFile: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = filesIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = filesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { name, file, id_worker } = req.body;
      try {
        const result = await pool.query(
          "UPDATE files SET name = $1, file = $2, id_worker = $3 WHERE id = $4 RETURNING *",
          [name, file, id_worker, id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Файл не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteFile: async (req, res) => {
      const { error } = filesIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "UPDATE files SET is_deleted = TRUE WHERE id = $1",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Файл удален" });
        } else {
          res.status(404).json({ message: "Файл не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
