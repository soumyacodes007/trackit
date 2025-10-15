"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// Get the directory name in ESM
const __filename = (0, url_1.fileURLToPath)(new URL(import.meta.url).pathname);
const __dirname = path_1.default.dirname(__filename);
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json()); // Allow JSON requests
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public'))); // Serve static files
// Home Route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
});
// GET route for fetching Devfolio hackathons
app.get('/api/hackathons/devfolio', async (req, res) => {
    try {
        const response = await axios_1.default.post('https://api.devfolio.co/api/search/hackathons', {
            type: 'application_open',
            from: 0,
            size: 50
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'https://devfolio.co',
                'Referer': 'https://devfolio.co/'
            }
        });
        res.json(response.data); // Send API response to frontend
    }
    catch (error) {
        console.error('Error fetching Devfolio hackathons:', error);
        res.status(500).json({ error: 'Failed to fetch Devfolio hackathons' });
    }
});
// GET route for fetching Devpost hackathons
app.get('/api/hackathons/devpost', async (req, res) => {
    try {
        // Using the correct Devpost API endpoint for hackathons
        const response = await axios_1.default.get('https://devpost.com/hackathons.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            params: {
                page: 1,
                per_page: 50,
                status: 'upcoming'
            }
        });
        res.json(response.data); // Send API response to frontend
    }
    catch (error) {
        console.error('Error fetching Devpost hackathons:', error);
        res.status(500).json({ error: 'Failed to fetch Devpost hackathons' });
    }
});
// Debug route to log API response structure
app.get('/api/debug', async (req, res) => {
    try {
        const response = await axios_1.default.post('https://api.devfolio.co/api/search/hackathons', {
            type: 'application_open',
            from: 0,
            size: 1
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'https://devfolio.co',
                'Referer': 'https://devfolio.co/'
            }
        });
        console.log(JSON.stringify(response.data.hits.hits[0], null, 2));
        res.json({ message: 'Debug information logged to console' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch debug info' });
    }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
exports.default = app;
