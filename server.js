const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files and parse form data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));  // To parse form data

// Hardcoded users (for demo purposes)
const users = [
    { username: 'admin', password: '123' }
];

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check for valid credentials
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.redirect('/');  // Redirect to home page after successful login
    } else {
        res.send('Invalid credentials');
    }
});

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve sustainability data page
app.get('/sustainability', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading sustainability data');
            return;
        }

        const sustainabilityData = JSON.parse(data);
        res.send(`
            <div class="sustainability-container">
                <h1>Sustainability Data</h1>
                <table>
                    <tr>
                        <th>Total Energy Used:</th>
                        <td>${sustainabilityData.energy_use.total_kWh} kWh</td>
                    </tr>
                    <tr>
                        <th>Total Water Used:</th>
                        <td>${sustainabilityData.water_conservation.total_liters} liters</td>
                    </tr>
                    <tr>
                        <th>Total Waste Generated:</th>
                        <td>${sustainabilityData.recycling_rate.total_waste} kg</td>
                    </tr>
                    <tr>
                        <th>Carbon Emissions:</th>
                        <td>${sustainabilityData.carbon_emissions.total_emissions_ton} tons</td>
                    </tr>
                </table>
                <a href="/" class="btn-back">Back to Home</a>
            </div>
        `);
    });
});
// Serve energy usage data page
app.get('/energy', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading energy usage data');
            return;
        }

        const energyData = JSON.parse(data);
        res.send(`
            <div class="energy-container">
                <h1>Energy Usage</h1>
                <table>
                    <tr>
                        <th>Total Energy Used:</th>
                        <td>${energyData.energy_usage.total_kWh} kWh</td>
                    </tr>
                </table>
                <a href="/" class="btn-back">Back to Home</a>
            </div>
        `);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
