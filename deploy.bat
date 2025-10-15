@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Test the server locally
echo 🧪 Testing server...
start /B npm run server
timeout /t 5 /nobreak > nul

REM Test API endpoint
curl -f http://localhost:5000/api/hackathons > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server test passed!
) else (
    echo ❌ Server test failed!
    taskkill /f /im node.exe > nul 2>&1
    exit /b 1
)

taskkill /f /im node.exe > nul 2>&1

echo 🎉 Application is ready for deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git push origin main
echo.
echo 2. Deploy backend to Railway:
echo    - Go to railway.app
echo    - Connect your GitHub repo
echo    - Set environment variables:
echo      PORT=5000
echo      NODE_ENV=production
echo      CORS_ORIGIN=https://your-frontend-url.vercel.app
echo.
echo 3. Deploy frontend to Vercel:
echo    - Go to vercel.com
echo    - Import your GitHub repo
echo    - Set environment variable:
echo      VITE_API_URL=https://your-backend-url.railway.app
echo.
echo 4. Update CORS_ORIGIN in Railway with your Vercel URL
echo.
echo Your hackathon tracker will be live! 🎊
pause
