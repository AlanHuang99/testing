const express = require('express');
const app = express();

// Reflected XSS vulnerability
app.get('/xss', (req, res) => {
    const userInput = req.query.input;
    res.send(`<h1>Your input: ${userInput}</h1>`); // Unsanitized user input
});

app.get('/', (req, res) => {
    res.send('Hello, insecure world!');
});

app.listen(8080, () => {
    console.log('Vulnerable app listening on port 8080!');
});
