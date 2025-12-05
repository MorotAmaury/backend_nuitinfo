const express = require('express');
const app = express();

const port = process.env.PORT || 3939;

app.enable('case sensitive routing');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for React frontend
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

require('./db');

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/projects'));
app.use('/api', require('./routes/participations'));
app.use('/api', require('./routes/talents'));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});

module.exports = app;
