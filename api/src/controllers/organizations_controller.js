const Joi = require("joi");

const organizationsSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  comment: Joi.string().max(250).required(),
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
      const { error } = organizationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
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
      const { error } = organizationsIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
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
