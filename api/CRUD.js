const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
  });

  class organizations_controller {
    async create_organization(req, res) {
        const { name, comment } = req.body;
        const new_organization = await db.query(
            'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *',
            [name, comment]
        );
        res.json(new_organization.rows[0]);
    }

    async get_organization(req, res) {
        const organizations = await db.query('SELECT * FROM organizations');
        res.json(organizations.rows);
    }

    async get_id_organization(req, res) {
        const id = req.params.id;
        const organizations = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
        if (organizations.rows.length > 0) {
            res.json(organizations.rows[0]);
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    }

    async update_organization(req, res) {
        const { id, name, comment } = req.body;
        const organizations = await db.query(
            'UPDATE organizations SET name = $1, comment = $2 WHERE id = $3 RETURNING *',
            [name, comment, id]
        );
        if (organizations.rows.length > 0) {
            res.json(organizations.rows[0]);
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    }


    async delete_organization(req, res) {
        const id = req.params.id;
        const result = await db.query('DELETE FROM organizations WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Организация удалена' });
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    }
}


class departments_controller {
    async create_department (req, res) {
        const { id_organization, name, id_parent, comment } = req.body;
        const new_department = await db.query(
            'INSERT INTO departments (id_organization, name, id_parent, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_organization, name, id_parent, comment]
        );
        res.json(new_department.rows[0]);
    }

    async get_department (req, res) {
        const departments = await db.query('SELECT * FROM departments');
        res.json(departments.rows);
    }

    async get_id_department (req, res) {
        const id = req.params.id;
        const departments = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
        if (departments.rows.length > 0) {
            res.json(departments.rows[0]);
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    }

    async update_department (req, res) {
        const { id, id_organization, name, id_parent, comment } = req.body;
        const departments = await db.query(
            'UPDATE departments SET id_organization = $1, name = $2, id_parent = $3, comment = $4 WHERE id = $5 RETURNING *',
            [id_organization, name, id_parent, comment, id]
        );
        if (departments.rows.length > 0) {
            res.json(departments.rows[0]);
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    }

    async delete_department (req, res) {
        const id = req.params.id;
        const result = await db.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Отдел удален' });
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    }
}


class positions_controller {
    async create_position (req, res) {
        const { name } = req.body;
        const new_position = await db.query('INSERT INTO positions (name) VALUES ($1) RETURNING *', [name]);
        res.json(new_position.rows[0]);
    }

    async get_position(req, res) {
        const positions = await db.query('SELECT * FROM positions');
        res.json(positions.rows);
    }

    async get_id_positions (req, res) {
        const id = req.params.id;
        const positions = await db.query('SELECT * FROM positions WHERE id = $1', [id]);
        if (positions.rows.length > 0) {
            res.json(positions.rows[0]);
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    }

    async update_positions (req, res) {
        const { id, name } = req.body;
        const positions = await db.query(
            'UPDATE positions SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (positions.rows.length > 0) {
            res.json(positions.rows[0]);
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    }

    async delete_position (req, res) {
        const id = req.params.id;
        const result = await db.query('DELETE FROM positions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Должность удалена' });
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    }
}