const express = require('express');
const app = express();

// 1. Disable security headers (CORS misconfiguration)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows any domain to access
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // No restriction on methods
    res.setHeader('Access-Control-Allow-Headers', '*'); // Allows all headers
    next();
});

// 2. Vulnerable endpoint to command injection
const { exec } = require('child_process');
app.get('/exec', (req, res) => {
    const command = req.query.cmd; // Directly executing user input
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`Stderr: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// 3. Reflected XSS vulnerability
app.get('/xss', (req, res) => {
    const userInput = req.query.input;
    res.send(`<h1>Your input: ${userInput}</h1>`); // Unsanitized user input in response
});

// 4. No rate limiting (DoS vulnerability)
app.get('/', (req, res) => {
    res.send('Hello, insecure world!');
});

app.listen(8080, () => {
    console.log('Vulnerable app listening on port 8080!');
});


