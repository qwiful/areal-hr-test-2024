const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
  });

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Для запуска прописать путь в сроке поиска (Пример: http://localhost:3000/organizations)');
});

app.post('/organizations', async (req, res) => {
    const { name, comment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *',
            [name, comment]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/organizations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM organizations');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/organizations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM organizations WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/organizations/:id', async (req, res) => {
    const { id } = req.params;
    const { name, comment } = req.body;
    try {
        const result = await pool.query(
            'UPDATE organizations SET name = $1, comment = $2 WHERE id = $3 RETURNING *',
            [name, comment, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/organizations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM organizations WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Организация удалена' });
        } else {
            res.status(404).json({ message: 'Организация не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/departments', async (req, res) => {
    const { id_organization, name, id_parent, comment } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO departments (id_organization, name, id_parent, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_organization, name, id_parent, comment]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { id_organization, name, id_parent, comment } = req.body;
    try {
        const result = await pool.query(
            'UPDATE departments SET id_organization = $1, name = $2, id_parent = $3, comment = $4 WHERE id = $5 RETURNING *',
            [id_organization, name, id_parent, comment, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Отдел удален' });
        } else {
            res.status(404).json({ message: 'Отдел не найден' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/positions', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO positions (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/positions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM positions');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/positions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM positions WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/positions/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE positions SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/positions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM positions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Должность удалена' });
        } else {
            res.status(404).json({ message: 'Должность не найдена' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});