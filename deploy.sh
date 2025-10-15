#!/bin/bash

# Hackathon Tracker Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Test the server locally
echo "🧪 Testing server..."
npm run server &
SERVER_PID=$!
sleep 5

# Test API endpoint
if curl -f http://localhost:5000/api/hackathons > /dev/null 2>&1; then
    echo "✅ Server test passed!"
else
    echo "❌ Server test failed!"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo "🎉 Application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy backend to Railway:"
echo "   - Go to railway.app"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables:"
echo "     PORT=5000"
echo "     NODE_ENV=production"
echo "     CORS_ORIGIN=https://your-frontend-url.vercel.app"
echo ""
echo "3. Deploy frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set environment variable:"
echo "     VITE_API_URL=https://your-backend-url.railway.app"
echo ""
echo "4. Update CORS_ORIGIN in Railway with your Vercel URL"
echo ""
echo "Your hackathon tracker will be live! 🎊"
