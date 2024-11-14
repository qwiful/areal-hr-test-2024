module.exports = (pool) => {
  return {
    create_operation: async (req, res) => {
      const {
        id_worker,
        id_department,
        id_position,
        setting_salary,
        salary_change,
        department_change,
        delite_worker,
      } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO personnel_operations (id_worker, id_department, id_position, setting_salary, salary_change, department_change, delite_worker) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [
            id_worker,
            id_department,
            id_position,
            setting_salary,
            salary_change,
            department_change,
            delite_worker,
          ]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    get_operations: async (req, res) => {
      try {
        const result = await pool.query("SELECT * FROM personnel_operations");
        res.json(result.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    get_operation_id: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT * FROM personnel_operations WHERE id = $1",
          [id]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Операция не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    update_operation: async (req, res) => {
      const { id } = req.params;
      const {
        id_worker,
        id_department,
        id_position,
        setting_salary,
        salary_change,
        department_change,
        delite_worker,
      } = req.body;
      try {
        const result = await pool.query(
          "UPDATE personnel_operations SET id_worker = $1, id_department = $2, id_position = $3, setting_salary = $4, salary_change = $5, department_change = $6, delite_worker = $7 WHERE id = $8 RETURNING *",
          [
            id_worker,
            id_department,
            id_position,
            setting_salary,
            salary_change,
            department_change,
            delite_worker,
            id,
          ]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: "Операция не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    delete_operation: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "DELETE FROM personnel_operations WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rows.length > 0) {
          res.json({ message: "Операция удалена" });
        } else {
          res.status(404).json({ message: "Операция не найдена" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  };
};
