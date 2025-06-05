# 🎬 ShuffleStream

**ShuffleStream** is a smart streaming assistant and launcher that connects all your existing streaming accounts into one place, providing advanced shuffle features to help you discover what to watch across platforms.

## 🧠 What is ShuffleStream?

ShuffleStream is **not** a traditional streaming platform. Instead, it's a smart launcher that:

- Connects all your existing streaming accounts (Netflix, Disney+, Hulu, Prime Video, etc.)
- Provides **advanced shuffle features** to help discover content across platforms
- Uses **deep links** to launch content in the apps you already subscribe to
- Offers **cultural visibility preferences** (opt in/out of themed content)
- Features **challenge systems** with progress bars, leaderboards, and recap stats
- Plans to host exclusive indie titles and offer premium reward tiers

## 🔀 Shuffle Modes

1. **Full Shuffle** – Anything, across all selected platforms
2. **Preference Shuffle** – Based on selected genres or viewing history
3. **Cable Mode** – Autoplay, endless channel-style experience
4. **List Shuffle** – Shuffle a user-curated pack
5. **Show Shuffle** – Random episode from a show

## 🔐 Cultural Theme Control

Users can toggle visibility for:
- Pride content
- Religious holidays
- Political content
- Social justice awareness
- Themed UI layers

Everything is **opt-in** – no one is forced to see content they don't align with.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Supabase (auth, database, storage)
- **UI**: Framer Motion + Lucide React
- **State**: Zustand
- **Charts**: Recharts

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shufflestream.git
   cd shufflestream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Database Schema

The app uses Supabase with the following main tables:
- `users` - User accounts and platform preferences
- `user_preferences` - Cultural content visibility settings
- `titles` - Content metadata with deep links
- `watched_titles` - User viewing history
- `shuffle_packs` - User-curated content lists
- `leaderboard` - Monthly user rankings
- `recap_data` - Personalized viewing statistics

## 🎯 Features

### Current (MVP)
- ✅ User authentication
- ✅ Platform selection and onboarding
- ✅ Multiple shuffle modes
- ✅ Cultural content preferences
- ✅ Viewing history tracking
- ✅ Binger's Challenge progress
- ✅ Monthly leaderboards
- ✅ Personalized recaps

### Future Roadmap
- 🔄 Music shuffle integration
- 🔄 Hosted indie content
- 🔄 Premium tiers with physical rewards
- 🔄 Advanced recommendation AI
- 🔄 Social features and sharing

## 📈 Growth Plan

1. **Phase 1**: Content launcher with shuffle features
2. **Phase 2**: User accounts, stats, and challenges
3. **Phase 3**: Hosted indie titles and music
4. **Phase 4**: Premium tiers and themed rewards

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**ShuffleStream** - Your smarter way to stream 🎬✨ 

A multi-platform smart launcher webapp for discovering, shuffling, and launching streaming content with cultural content preferences and social features.

## 🚀 Features

### Core Features
- **Smart Shuffle Modes**: Full, Preference, Show, List, and Platform-based shuffling
- **Cultural Content Preferences**: Opt-in toggles for pride, religious, political, and social justice content
- **Multi-Platform Support**: Netflix, Disney+, Hulu, HBO Max, Amazon Prime, Apple TV+, Peacock, Paramount+
- **Social Features**: Friend connections, leaderboards, activity feeds, and achievements
- **Personal Lists & Shuffle Packs**: Create and share custom content collections
- **Cable Mode**: TV-style autoplay with genre-based channels
- **Viewing Analytics**: Detailed stats, yearly recaps, and insights
- **Admin Dashboard**: Comprehensive content and user management

### Pages Implemented
- `/` - Landing page
- `/login` - User authentication
- `/signup` - User registration
- `/onboarding` - 4-step setup process
- `/dashboard` - Main user dashboard
- `/shuffle` - Smart content shuffling
- `/browse` - Content discovery and search
- `/my-list` - Personal content management
- `/cable` - TV-style autoplay experience
- `/leaderboard` - Social rankings and achievements
- `/recap` - Viewing statistics and yearly summaries
- `/settings/preferences` - User preferences and settings
- `/admin` - Administrative dashboard

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend Ready**: API client, authentication hooks, database schema
- **Database**: PostgreSQL with comprehensive schema
- **APIs**: TMDB integration, streaming service APIs via RapidAPI
- **Authentication**: JWT-based with refresh tokens
- **State Management**: React Context with custom hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ShuffleStream.git
   cd ShuffleStream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb shufflestream
   
   # Run the schema
   psql -d shufflestream -f lib/database/schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Backend Integration

### API Structure
The application is ready for backend integration with:

- **API Client** (`lib/api/client.ts`): Complete REST client with all endpoints
- **Type Definitions** (`lib/api/types.ts`): Comprehensive TypeScript interfaces
- **Authentication Hook** (`hooks/useAuth.ts`): User authentication state management
- **Database Schema** (`lib/database/schema.sql`): PostgreSQL schema for all features

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/shufflestream"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
JWT_SECRET="your-jwt-secret-here"

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"

# RapidAPI (for streaming services)
RAPIDAPI_KEY="your-rapidapi-key"
```

### API Endpoints Structure

```
/api/auth/*          - Authentication endpoints
/api/users/*         - User management
/api/content/*       - Content discovery and management
/api/shuffle/*       - Shuffle functionality
/api/lists/*         - User lists and shuffle packs
/api/viewing/*       - Watch history and sessions
/api/social/*        - Social features
/api/leaderboard/*   - Rankings and achievements
/api/analytics/*     - User statistics and recaps
/api/admin/*         - Administrative functions
```

### Database Tables

The schema includes 25+ tables covering:
- User management and preferences
- Content metadata and relationships
- Viewing history and analytics
- Social features and friendships
- Administrative and moderation tools
- Cultural content tagging system

## 🎨 Cultural Content System

ShuffleStream includes a comprehensive cultural content preference system:

- **Pride Content**: LGBTQ+ themed content
- **Religious Content**: Faith-based programming
- **Political Content**: Political documentaries and shows
- **Social Justice Content**: Content addressing social issues
- **Mature Content**: Adult-oriented programming
- **International Content**: Non-English content

Users can opt-in to each category during onboarding and modify preferences anytime.

## 🔐 Authentication

The app uses JWT-based authentication with:
- Access tokens for API requests
- Refresh token rotation
- Protected route components
- Admin role-based access control

## 📊 Analytics & Insights

Comprehensive analytics system tracking:
- Watch time and viewing patterns
- Content preferences and ratings
- Social interactions and achievements
- Platform usage statistics
- Yearly viewing recaps with insights

## 🎮 Social Features

- **Friend System**: Send/accept friend requests
- **Leaderboards**: Weekly, monthly, and all-time rankings
- **Achievements**: Unlock badges for viewing milestones
- **Activity Feeds**: See what friends are watching
- **Shuffle Pack Sharing**: Create and share content collections

## 🛡 Admin Features

Comprehensive admin dashboard with:
- User management and moderation
- Content approval workflow
- Analytics and insights
- Report management
- System configuration

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend Requirements
- Node.js API server
- PostgreSQL database
- Redis for caching (optional)
- File storage (AWS S3 or Cloudinary)

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Set up API server
5. Configure CORS and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Features

- **ShuffleSound**: Music streaming integration
- **Indie Content Hosting**: Support for independent creators
- **Physical Rewards**: Merchandise and real-world prizes
- **Advanced AI**: Machine learning-powered recommendations
- **Mobile Apps**: Native iOS and Android applications

## 📞 Support

For support, email support@shufflestream.com or create an issue on GitHub.

---

Built with ❤️ for streaming enthusiasts everywhere. 