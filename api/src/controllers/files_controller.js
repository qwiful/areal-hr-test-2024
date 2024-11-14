module.exports = (pool) => {
  return {
    create_file: async (req, res) => {
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

    get_files: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM files");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    get_file_id: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query("SELECT * FROM files WHERE id = $1", [
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

    update_file: async (req, res) => {
      const { id } = req.params;
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

    delete_file: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM files WHERE id = $1 RETURNING *",
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
