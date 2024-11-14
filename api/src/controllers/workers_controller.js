const Joi = require("joi");

const workersSchema = Joi.object({
  surname: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(1).max(50).required(),
  patronymic: Joi.string().min(1).max(50).optional(),
  date_of_birth: Joi.date().required(),
  id_passport: Joi.number().integer().required(),
  id_adress: Joi.number().integer().required(),
});

const workersIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = (pool) => {
  return {
    createWorker: async (req, res) => {
      const { error } = workersSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const {
        surname,
        name,
        patronymic,
        date_of_birth,
        id_passport,
        id_address,
      } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO workers (surname, name, patronymic, date_of_birth, id_passport, id_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
          [surname, name, patronymic, date_of_birth, id_passport, id_address]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getWorkers: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM workers");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getWorkerById: async (req, res) => {
      const { error } = workersIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query("SELECT * FROM workers WHERE id = $1", [
          id,
        ]);
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Работник не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    updateWorker: async (req, res) => {
      const { id } = req.params;
      const { error: idError } = workersIdSchema.validate(req.params);
      if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
      }
      const { error } = workersSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const {
        surname,
        name,
        patronymic,
        date_of_birth,
        id_passport,
        id_address,
      } = req.body;
      try {
        const result = await pool.query(
          "UPDATE workers SET surname = $1, name = $2, patronymic = $3, date_of_birth = $4, id_passport = $5, id_address = $6 WHERE id = $7 RETURNING *",
          [
            surname,
            name,
            patronymic,
            date_of_birth,
            id_passport,
            id_address,
            id,
          ]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Работник не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    deleteWorker: async (req, res) => {
      const { error } = workersIdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM workers WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Работник удален" });
        } else {
          res.status(404).json({ message: "Работник не найден" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
