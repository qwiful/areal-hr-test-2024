module.exports = (pool) => {
  return {
    createOrganization: async (req, res) => {
      const { name, comment } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *",
          [name, comment]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOrganizations: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM organizations");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getOrganizationById: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM organizations WHERE id = $1",
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
      const { name, comment } = req.body;
      try {
        const result = await pool.query(
          "UPDATE organizations SET name = $1, comment = $2 WHERE id = $3 RETURNING *",
          [name, comment, id]
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

    deleteOrganization: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM organizations WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Организация удалена" });
        } else {
          res.status(404).json({ message: "Организация не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
