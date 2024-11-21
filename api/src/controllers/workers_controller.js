const Joi = require("joi");

const workersSchema = Joi.object({
  surname: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(1).max(50).required(),
  patronymic: Joi.string().min(1).max(50).optional(),
  date_of_birth: Joi.date().required(),
  id_passport: Joi.object({
    series: Joi.number().integer().required(),
    number: Joi.number().integer().required(),
    date_issue: Joi.date().required(),
    unit_kod: Joi.number().integer().required(),
    issued_by_whom: Joi.string().max(100).required(),
  }).required(),
  id_adress: Joi.object({
    region: Joi.string().min(1).max(50).required(),
    locality: Joi.string().min(1).max(50).required(),
    street: Joi.string().min(1).max(50).required(),
    house: Joi.string().min(1).max(10).required(),
    building: Joi.string().max(10),
    apartment: Joi.number().integer().required(),
  }).required(),
  is_deleted: Joi.boolean().required(),
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
        id_adress,
      } = req.body;
      try {
        const passportResult = await pool.query(
          "INSERT INTO passport (series, number, date_issue, unit_kod, issued_by_whom) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [
            id_passport.series,
            id_passport.number,
            id_passport.date_issue,
            id_passport.unit_kod,
            id_passport.issued_by_whom,
          ]
        );
        const id_passport_worker = passportResult.rows[0].id;
        const adressResult = await pool.query(
          "INSERT INTO adress (region, locality, street, house, building, apartment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [
            id_adress.region,
            id_adress.locality,
            id_adress.street,
            id_adress.house,
            id_adress.building,
            id_adress.apartment,
          ]
        );
        const id_adress_worker = adressResult.rows[0].id;
        const result = await pool.query(
          "INSERT INTO workers (surname, name, patronymic, date_of_birth, id_passport, id_adress) values ($1, $2, $3, $4, $5, $6) RETURNING *",
          [
            surname,
            name,
            patronymic,
            date_of_birth,
            id_passport_worker,
            id_adress_worker,
          ]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Работник", JSON.stringify(result.rows[0])]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    getWorkers: async (req, res) => {
      try {
        const result = await pool.query(
          "SELECT w.*, p.series, p.number, p.date_of_issue, p.unit_kod, p.issued_by_whom, a.region, a.locality, a.street, a.house, a.building, a.apartment FROM workers w LEFT JOIN passport p ON w.id_passport = p.id LEFT JOIN adress a ON w.id_adress = a.id WHERE w.is_deleted = FALSE"
        );
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
        const result = await pool.query(
          "SELECT w.*, p.series, p.number, p.date_of_issue, p.unit_kod, p.issued_by_whom, a.region, a.locality, a.street, a.house, a.building, a.apartment FROM workers w LEFT JOIN passport p ON w.id_passport = p.id LEFT JOIN adress a ON w.id_adress = a.id AND w.is_deleted = FALSE",
          [id]
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
        id_adress,
      } = req.body;
      const id_passport_worker = id_passport.id;
      const id_adress_worker = id_adress.id;
      try {
        const currentResult = await pool.query(
          "SELECT * FROM workers WHERE id = $1",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ message: "Работник не найден" });
        }
        const oldData = currentResult.rows[0];
        await pool.query(
          "UPDATE passport SET series = $1, number = $2, date_issue = $3, unit_kod = $4, issued_by_whom = $5 WHERE id = $6",
          [
            id_passport.series,
            id_passport.number,
            id_passport.date_issue,
            id_passport.unit_kod,
            id_passport.issued_by_whom,
            id_passport_worker,
          ]
        );

        await pool.query(
          "UPDATE adress SET region = $1, locality = $2, street = $3, house = $4, building = $5, apartment = $6 WHERE id = $7",
          [
            id_adress.region,
            id_adress.locality,
            id_adress.street,
            id_adress.house,
            id_adress.building,
            id_adress.apartment,
            id_adress_worker,
          ]
        );
        const result = await pool.query(
          "UPDATE workers set surname = $1, name = $2, patronymic = $3, date_of_birth = $4, id_passport = $5, id_adress = $6 WHERE id = $7 RETURNING *",
          [surname, name, patronymic, date_of_birth, id_passport, id_adress, id]
        );
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [
            req.user.id,
            "Работник",
            JSON.stringify({ old: oldData, new: result.rows[0] }),
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
        const currentResult = await pool.query(
          "SELECT * FROM workers w LEFT JOIN passport p ON w.id_passport = p.id LEFT JOIN adress a ON w.id_adress = a.id WHERE w.id = $1 AND w.is_deleted = FALSE",
          [id]
        );
        if (currentResult.rows.length === 0) {
          return res
            .status(404)
            .json({ message: "Работник не найден или уже удален" });
        }
        const oldData = currentResult.rows[0];
        await pool.query("UPDATE workers SET is_deleted = TRUE WHERE id = $1", [
          id,
        ]);
        await pool.query(
          "INSERT INTO history_changes (date_time_operation, who_changed, object, changed_field) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)",
          [req.user.id, "Работник", JSON.stringify(oldData)]
        );
        res.json({ message: "Работник удален" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
