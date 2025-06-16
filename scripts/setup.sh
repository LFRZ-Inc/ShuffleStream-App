#!/bin/bash

# ShuffleStream Setup Script
echo "🎬 Setting up ShuffleStream..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from example..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your actual API keys and Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys and Supabase credentials"
echo "2. Create a Supabase project and run the schema from supabase-schema.sql"
echo "3. Run the sample data script from scripts/populate-sample-data.sql"
echo "4. Start the development server: npm run dev"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" 