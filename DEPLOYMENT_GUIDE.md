# ShuffleStream Deployment Guide

## 🚀 Complete Setup Instructions

This guide will help you deploy a fully functional ShuffleStream application with all features working end-to-end.

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account
- API keys for external services (TMDB, RapidAPI)

## 1. Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# External APIs
TMDB_API_KEY=your-tmdb-api-key
RAPIDAPI_KEY=your-rapidapi-key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Supabase Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Install Schema
Run the database schema:

```sql
-- Copy and paste the contents of supabase-schema.sql into your Supabase SQL editor
```

### Step 3: Populate Sample Data
Run the sample data script:

```sql
-- Copy and paste the contents of scripts/populate-sample-data.sql
```

### Step 4: Configure RLS (Row Level Security)
The schema includes RLS policies. Ensure they're enabled in your Supabase dashboard.

## 3. API Keys Setup

### TMDB API Key
1. Visit [The Movie Database API](https://developers.themoviedb.org/3)
2. Register and get your API key
3. Add to your `.env.local`

### RapidAPI Key (Optional)
1. Visit [RapidAPI](https://rapidapi.com)
2. Subscribe to streaming availability APIs
3. Add to your `.env.local`

## 4. Install Dependencies

```bash
npm install
# or
pnpm install
```

## 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

## 6. Testing the Application

### Authentication Flow
1. Visit `http://localhost:3000`
2. Register a new account
3. Verify the user appears in your Supabase `users` table

### Shuffle Features
1. Navigate to `/shuffle`
2. Select a shuffle mode
3. Click "Shuffle Now"
4. Verify API calls are working in Network tab

### Test API Endpoints
Open `test-apis.html` in your browser to test all endpoints:
- Shuffle API
- Leaderboard API
- Recap API

## 7. Production Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Supabase Production
1. Upgrade to Supabase Pro if needed
2. Configure custom domain
3. Update CORS settings for your domain

## 8. Features Overview

### ✅ Implemented Features

**Authentication & User Management:**
- Supabase authentication
- User profiles with preferences
- Cultural content filtering
- Platform management

**Smart Shuffle System:**
- 5 shuffle modes (Mood, Social, Quick, Blind, Perfect Match)
- Cultural preference filtering
- Platform availability checking
- Watch history exclusion

**Social Features:**
- Monthly leaderboards
- Binger level progression (6 levels)
- Achievement system
- Friend connections

**Analytics & Insights:**
- Monthly viewing recaps (Spotify Wrapped style)
- Watch time tracking
- Genre analytics
- Personal insights

**Platform Integration:**
- 8+ streaming platforms supported
- Deep linking for direct content access
- Platform-specific content filtering

### 🔧 API Endpoints

- `POST /api/shuffle/full` - Smart content shuffling
- `GET/POST /api/shuffle/list` - Shuffle pack management
- `GET /api/leaderboard` - Monthly rankings
- `GET/POST /api/recap/monthly` - Viewing analytics

## 9. Database Schema

The database includes 12+ tables:
- `users` - User profiles
- `titles` - Content database
- `platforms` - Streaming services
- `user_preferences` - Cultural content settings
- `watch_history` - Viewing tracking
- `leaderboards` - Rankings data
- `achievements` - Gamification
- `friendships` - Social connections

## 10. Troubleshooting

### Common Issues

**Authentication not working:**
- Check Supabase URL and keys
- Verify RLS policies are enabled
- Check browser console for errors

**Shuffle returning no results:**
- Ensure sample data is loaded
- Check API endpoint responses
- Verify user preferences are set

**API errors:**
- Check environment variables
- Verify Supabase service role key
- Check database table permissions

### Debug Tools

1. **API Testing:** Use `test-apis.html`
2. **Database:** Check Supabase table editor
3. **Logs:** Check Vercel function logs
4. **Console:** Browser developer tools

## 11. Customization

### Adding New Platforms
1. Update `populate-sample-data.sql`
2. Add platform to UI components
3. Configure deep linking URLs

### Custom Shuffle Modes
1. Modify shuffle API logic
2. Update frontend shuffle modes
3. Add new filtering criteria

### Cultural Content Types
1. Extend content type enum
2. Update preference UI
3. Modify filtering logic

## 12. Performance Optimization

- Enable Supabase connection pooling
- Implement Redis caching for frequently accessed data
- Optimize API response times
- Add loading states throughout UI

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Test individual API endpoints
4. Verify environment configuration

---

**Congratulations!** You now have a fully functional ShuffleStream application with smart shuffling, social features, analytics, and multi-platform support. 🎉 