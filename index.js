// Import express
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
//Middleware untuk parsing JSON body
app.use(express.json());

// Buat koneksi ke DB
const connection = mysql.createConnection({
    host: 'mysql.srusun.id',
    user: 'candra',
    password: 'CandraSRusunDB!2025',
    database: 'candra'
});

//Test koneksi
connection.connect(err => {
    if (err) throw err;
    console.log("Tersambung ke database MySQL");
});

//GET untuk ambil tabel comments
app.get('/api/comments', (req, res) => {
    connection.query('SELECT * FROM comments', (err, results) =>{
        if (err){
            console.error('Error query:', err);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(results);
    })
});

//POST untuk posting komenter
app.post('/api/comments', (req, res) => {
    const {name, comment} = req.body;
    const created_at = new Date();

    connection.query(
        'INSERT INTO comments (name, comment, created_at) VALUES (?,?,?)',
        [name, comment, created_at],
        (err, result) => {
            if (err) throw err;
            res.json({id: result.insertId, name, comment, created_at});
        }
    );
});

//DELETE untuk hapus komentar
app.delete('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM comments WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error('Error deleting comment:', err);
                res.status(500).json({ error: 'Failed to delete comment' });
                return;
            }
            res.json({message: 'Comment deleted', id});
        }

    );
});
// UPDATE komentar
app.put('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    connection.query('UPDATE comments SET comment = ? WHERE id =?',
        [comment, id],
        (err, result) => {
            if(err) {
                console.error('Error updating comment:', err);
                res.status(500).json({error: 'Failed to update comment'});
                return;
            }
            res.json({message: 'Comment updated', id});
        }
    );
});



//GET untuk ambil tabel property
app.get('/api/property', (req, res) => {
    connection.query('SELECT * FROM property', (err, results) =>{
        if (err) {
            console.error('Error query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

//GET /api/find-property?name=CT35 untuk mencari
app.get('/api/find-property', (req, res) => {
    const { name } = req.query;
    const sql = 'SELECT * FROM property WHERE name = ?';
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Error query', err);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(results);
    });
});

//POST untuk INSERT ke tabel property
app.post('/api/property', (req, res) => {
    const {name, address, location} = req.body;
    const sql = 'INSERT INTO property (name, address, location) VALUES (?, ?, ?)';
    connection.query(sql, [name, address, location], (err, result) => {
        if (err) {
            console.error('Error insert:', err);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json({
            message: 'Properti berhasil ditambahkan!',
            properyID: result.insertId
        })
    });
});

//GET /
app.get('/', (req, res) => {
    res.send('Ini halaman utama (Home)');
});

//GET /about
app.get('/about', (req, res) => {
    res.send('Ini halaman About');
});

// GET /api/hello
app.get('/api/hello', (req, res)=>{
    res.json({message: 'Hello from Express.js server!'});
});

// POST /api/echo
app.post('/api/echo', (req, res) => {
    console.log('Body POST:', req.body);
    res.json({
        message: 'Data diterima!',
        you_sent: req.body
    });
});

// Route fallback (404)
app.use((req, res) => {
    res.status(404).send('404 - Halaman tidak ditemukan');
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server berjalan di http://localhost:${PORT}`);
});
