const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    user: 'katherine-medina',     
    host: 'localhost',
    database: 'repertorio',
    password: 'hola',
    port: 5432,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// POST /cancion: Agregar una nueva canción
app.post('/cancion', async (req, res) => {
    const { titulo, artista, tono } = req.body;
    const query = {
        text: 'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3)',
        values: [titulo, artista, tono],
    };
    try {
        await pool.query(query);
        res.status(201).send('Canción agregada con éxito');
    } catch (err) {
        console.error('Error agregando canción:', err);
        res.status(500).send('Error agregando canción');
    }
});

// GET /canciones: Obtener todas las canciones
app.get('/canciones', async (req, res) => {
    const query = 'SELECT * FROM canciones';
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error obteniendo canciones:', err);
        res.status(500).send('Error obteniendo canciones');
    }
});

// PUT /cancion/:id: Actualizar una canción existente
app.put('/cancion/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    const query = {
        text: 'UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4',
        values: [titulo, artista, tono, id],
    };
    try {
        await pool.query(query);
        res.status(200).send('Canción actualizada con éxito');
    } catch (err) {
        console.error('Error actualizando canción:', err);
        res.status(500).send('Error actualizando canción');
    }
});

// DELETE /cancion: Eliminar una canción por id
app.delete('/cancion', async (req, res) => {
    const { id } = req.query;
    const query = {
        text: 'DELETE FROM canciones WHERE id = $1',
        values: [id],
    };
    try {
        await pool.query(query);
        res.status(200).send('Canción eliminada con éxito');
    } catch (err) {
        console.error('Error eliminando canción:', err);
        res.status(500).send('Error eliminando canción');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
