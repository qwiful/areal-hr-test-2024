module.exports = (pool) => {
  return {
    create_change: async (req, res) => {
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

    get_changes: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM history_changes");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    get_change_id: async (req, res) => {
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

    update_change: async (req, res) => {
      const { id } = req.params;
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

    delete_change: async (req, res) => {
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
