const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Sample salon data (can be replaced with database)
let salons = [
    { id: 1, name: 'Salon A', address: '123 Main St, City', description: 'Sample salon description' },
    { id: 2, name: 'Salon B', address: '456 Elm St, City', description: 'Sample salon description' },
    { id: 3, name: 'Salon C', address: '789 Oak St, City', description: 'Sample salon description' },
];

// Middleware to parse JSON body
app.use(bodyParser.json());

// Mock user data (for demo purposes, replace with database)
const users = [
    { id: 1, username: 'salonowner', password: 'password', role: 'salon_owner' }
];

// Middleware to authenticate user and generate JWT
function authenticateUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Generate JWT token
        const token = jwt.sign({ username: user.username, role: user.role }, 'secret_key', { expiresIn: '1h' });
        return token;
    }
    return null;
}

// Route to authenticate and generate JWT token
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const token = authenticateUser(username, password);
    if (token) {
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.username = decoded.username;
        req.role = decoded.role;
        next();
    });
}

// Route to update salon details (restricted to salon owners)
app.put('/api/salon/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { name, address, description } = req.body;

    // Example: Update salon details in the salons array (replace with DB update)
    const index = salons.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
        salons[index] = { id: parseInt(id), name, address, description };
        res.json({ message: 'Salon details updated successfully' });
    } else {
        res.status(404).json({ error: 'Salon not found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
