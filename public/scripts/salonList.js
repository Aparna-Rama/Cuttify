const express = require('express');
const app = express();
const port = 3000;

// Sample salon data
const salons = [
    { id: 1, name: 'Salon A', address: '123 Main St, City', latitude: -34.397, longitude: 150.644 },
    { id: 2, name: 'Salon B', address: '456 Elm St, City', latitude: -35.397, longitude: 151.644 },
    { id: 3, name: 'Salon C', address: '789 Oak St, City', latitude: -36.397, longitude: 152.644 },
];

// Serve the HTML file
app.use(express.static(__dirname));

// API endpoint to get salon data
app.get('/api/salons', (req, res) => {
    res.json(salons);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
