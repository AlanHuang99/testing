const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Using SQLite for demonstration

const app = express();
const db = new sqlite3.Database(':memory:'); // In-memory database for testing

// Create a dummy users table
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie')");
});

// Vulnerable SQL Injection endpoint
app.get('/user', (req, res) => {
    const username = req.query.name;
    const query = `SELECT * FROM users WHERE name = ?`; // Parameterized query

    db.all(query, [username], (err, rows) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.send('Hello, insecure world!');
});

app.listen(8080, () => {
    console.log('Vulnerable app listening on port 8080!');
});
