import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchDevpostHackathons, fetchUnstopHackathons, fetchDevfolioHackathons } from '@/services/hackathons';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Number of pages to fetch from each source
const PAGE_SIZE = 6;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON requests
app.use(express.static(path.join(__dirname, '../../public'))); // Serve static files

// Home Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// GET route for fetching Devfolio hackathons
app.get('/api/hackathons/devfolio', async (req, res) => {
  try {
    const response = await axios.post('https://api.devfolio.co/api/search/hackathons', {
      type: 'application_open',
      from: 0,
      size: 50
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://devfolio.co',
        'Referer': 'https://devfolio.co/'
      }
    });

    res.json(response.data); // Send API response to frontend
  } catch (error) {
    console.error('Error fetching Devfolio hackathons:', error);
    res.status(500).json({ error: 'Failed to fetch Devfolio hackathons' });
  }
});

// Debug route to log API response structure
app.get('/api/debug', async (req, res) => {
  try {
    const response = await axios.post('https://api.devfolio.co/api/search/hackathons', {
      type: 'application_open',
      from: 0,
      size: 1
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://devfolio.co',
        'Referer': 'https://devfolio.co/'
      }
    });

    console.log(JSON.stringify(response.data.hits.hits[0], null, 2));
    res.json({ message: 'Debug information logged to console' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch debug info' });
  }
});

// GET route for fetching hackathons from both Devpost and Unstop
app.get('/api/hackathons', async (req, res) => {
  try {
    // Create arrays of promises for fetching multiple pages concurrently
    const devpostPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchDevpostHackathons(i + 1)
    );
    
    const unstopPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchUnstopHackathons(i + 1)
    );
    
    const devfolioPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchDevfolioHackathons(i + 1)
    );
    
    // Fetch data from all sources concurrently
    const [devpostResults, unstopResults, devfolioResults] = await Promise.all([
      Promise.all(devpostPromises),
      Promise.all(unstopPromises),
      Promise.all(devfolioPromises)
    ]);
    
    // Flatten the results from paginated calls
    const devpostHackathons = devpostResults.flat();
    const unstopHackathons = unstopResults.flat();
    const devfolioHackathons = devfolioResults.flat();
    
    console.log('Devpost hackathons fetched:', devpostHackathons.length);
    console.log('Unstop hackathons fetched:', unstopHackathons.length);
    console.log('Devfolio hackathons fetched:', devfolioHackathons.length);
    
    // Combine the arrays
    const hackathons = [...devpostHackathons, ...unstopHackathons, ...devfolioHackathons];
    
    console.log('Total hackathons combined:', hackathons.length);
    
    // Return successful response
    res.status(200).json({
      hackathons,
      count: hackathons.length
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    
    // Return error response
    res.status(500).json({
      error: 'Failed to fetch hackathons',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug route to test individual sources
app.get('/api/hackathons/devpost', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const hackathons = await fetchDevpostHackathons(page);
    res.status(200).json({
      hackathons,
      count: hackathons.length
    });
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    res.status(500).json({
      error: 'Failed to fetch Devpost hackathons',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/hackathons/unstop', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const hackathons = await fetchUnstopHackathons(page);
    res.status(200).json({
      hackathons,
      count: hackathons.length
    });
  } catch (error) {
    console.error('Error fetching Unstop hackathons:', error);
    res.status(500).json({
      error: 'Failed to fetch Unstop hackathons',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

export default app; 