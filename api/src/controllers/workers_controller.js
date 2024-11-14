module.exports = (pool) => {
  return {
    create_worker: async (req, res) => {
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

    get_workers: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM workers");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    get_worker_id: async (req, res) => {
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

    update_worker: async (req, res) => {
      const { id } = req.params;
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

    delete_worker: async (req, res) => {
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
