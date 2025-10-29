const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes/routes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// API routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('GBV Reporting & Support API');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    // Connect to database when running the server directly
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}

module.exports = app;