// src/server/index.ts
import app from './hackathonServer';

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Hackathon server running on http://localhost:${PORT}`));