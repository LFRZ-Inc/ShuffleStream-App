# 🎬 ShuffleStream - Smart Streaming Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## ✨ Overview

ShuffleStream is a **smart streaming assistant** that revolutionizes how you discover and watch content across multiple streaming platforms. With advanced shuffle algorithms, cultural content filtering, social features, and AI-powered insights, ShuffleStream eliminates the "what to watch" dilemma forever.

## 🚀 Key Features

### 🎲 Smart Shuffle System
- **5 Shuffle Modes**: Mood, Social, Quick, Blind, Perfect Match
- **Cultural Content Filtering**: Opt-out system for Pride, Religious, Political, Social Justice content
- **Multi-Platform Integration**: Netflix, Disney+, Hulu, Prime Video, HBO Max, Paramount+, Peacock, Apple TV+
- **Smart Algorithms**: Exclude watched content, consider viewing preferences

### 👥 Social & Gamification
- **Monthly Leaderboards**: Compete with friends on viewing stats
- **6 Binger Levels**: Progress from Couch Potato to Streaming Legend
- **Achievement System**: 10+ achievements to unlock
- **Social Sharing**: Share discoveries and compete with friends

### 📊 Analytics & Insights
- **Monthly Recaps**: Spotify Wrapped-style viewing summaries
- **Watch Tracking**: Detailed viewing history and analytics
- **Genre Analysis**: Understand your viewing preferences
- **Personal Insights**: AI-powered viewing recommendations

### 🛡️ Privacy & Preferences
- **Cultural Content Control**: Granular filtering for sensitive content
- **Platform Management**: Choose which services to include
- **Privacy First**: All data encrypted and user-controlled
- **Customizable Experience**: Tailor the app to your preferences

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL), Row Level Security
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **APIs**: Custom REST endpoints for shuffle, leaderboard, analytics
- **External APIs**: TMDB for content metadata

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase account
- TMDB API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LFRZ-Inc/ShuffleStream-App.git
   cd ShuffleStream-App
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the schema: Copy `supabase-schema.sql` to your Supabase SQL editor
   - Load sample data: Copy `scripts/populate-sample-data.sql` to your Supabase SQL editor

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Test the APIs**
   - Open `test-apis.html` in your browser to test all endpoints

## 📖 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture

## 🔧 API Endpoints

- `POST /api/shuffle/full` - Smart content shuffling
- `GET/POST /api/shuffle/list` - Shuffle pack management
- `GET /api/leaderboard` - Monthly user rankings
- `GET/POST /api/recap/monthly` - Viewing analytics and insights

## 🎯 Features in Detail

### Smart Shuffle Modes

1. **Mood Shuffle** - Content based on your current mood
2. **Social Shuffle** - Popular and trending content
3. **Quick Shuffle** - Fast recommendations when you're in a hurry
4. **Blind Shuffle** - Mystery content with no spoilers
5. **Perfect Match** - AI-powered personalized recommendations

### Cultural Content Filtering

ShuffleStream respects diverse preferences with opt-out controls for:
- Pride/LGBTQ+ content
- Religious content
- Political content
- Social justice themes

### Binger Level Progression

- 🥔 **Couch Potato** (0 points)
- 👀 **Casual Viewer** (100 points)
- 📺 **Binge Watcher** (500 points)
- 🎬 **Stream Master** (1,500 points)
- 🧠 **Content Connoisseur** (3,000 points)
- 👑 **Streaming Legend** (5,000 points)

## 🛠️ Development

### Project Structure
```
├── app/
│   ├── api/          # API routes
│   ├── components/   # Reusable components
│   └── pages/        # Next.js pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── store/            # Zustand stores
├── scripts/          # Database and setup scripts
└── docs/             # Documentation
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Other Platforms
- See [Deployment Guide](DEPLOYMENT_GUIDE.md) for detailed instructions

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- User data encryption
- Secure authentication with Supabase
- API rate limiting
- Input validation and sanitization

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with 12+ tables:
- User management and preferences
- Content database with cultural tagging
- Platform integration
- Watch history and analytics
- Social features and achievements
- Leaderboard and ranking data

## 🎉 What Makes ShuffleStream Special

1. **Cultural Sensitivity**: First streaming assistant with granular content filtering
2. **True Multi-Platform**: Works across 8+ major streaming services
3. **Social Gaming**: Turn watching into a social, competitive experience
4. **AI-Powered Insights**: Get Spotify Wrapped for your streaming habits
5. **Privacy First**: You control your data and preferences
6. **Smart Algorithms**: Advanced recommendation engine that learns your preferences

## 📞 Support

- Check the [Deployment Guide](DEPLOYMENT_GUIDE.md) for setup issues
- Review the [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for technical details
- Open an issue for bugs or feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** for movie and TV show metadata
- **Supabase** for database and authentication
- **Next.js** team for the amazing framework
- **Streaming platforms** for inspiring this project

---

**Built with ❤️ by the ShuffleStream Team**

*Transform your streaming experience today!* 🎬✨ 