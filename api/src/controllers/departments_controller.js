module.exports = (pool) => {
  return {
    createDepartment: async (req, res) => {
      const { id_organization, name, id_parent, comment } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO departments (id_organization, name, id_parent, comment) VALUES ($1, $2, $3, $4) RETURNING *",
          [id_organization, name, id_parent, comment]
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
      const { id_organization, name, id_parent, comment } = req.body;
      try {
        const result = await pool.query(
          "UPDATE departments SET id_organization = $1, name = $2, id_parent = $3, comment = $4 WHERE id = $5 RETURNING *",
          [id_organization, name, id_parent, comment, id]
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

    deleteDepartment: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM departments WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Отдел удален" });
        } else {
          res.status(404).json({ message: "Отдел не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
