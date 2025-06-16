# ShuffleStream Setup Guide

Follow these steps to make ShuffleStream fully functional.

## 🗄️ Database Setup

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (this takes a few minutes)

### 2. Deploy the Database Schema
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste it into the SQL Editor and run it
5. This will create all necessary tables and security policies

## 🔑 Environment Variables

### 1. Copy Environment File
```bash
cp env.example .env.local
```

### 2. Fill in Required Variables
Edit `.env.local` with your actual values:

```env
# REQUIRED - Get these from your Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# REQUIRED - Get from TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key-here

# REQUIRED - Get from RapidAPI
RAPIDAPI_KEY=your-rapidapi-key-here

# REQUIRED - Generate a secure secret
JWT_SECRET=your-jwt-secret-here-for-server-side-auth
```

### 3. Get API Keys

#### TMDB API Key:
1. Go to [TMDB](https://www.themoviedb.org/settings/api)
2. Sign up for an account
3. Request an API key
4. Copy the API key to your `.env.local`

#### RapidAPI Key:
1. Go to [RapidAPI](https://rapidapi.com)
2. Sign up for an account
3. Subscribe to the "Streaming Availability" API
4. Copy your API key to your `.env.local`

## 🚀 Start the Application

```bash
npm install
npm run dev
```

## 🧪 Testing the APIs

### Test Shuffle API
```bash
# Test full shuffle
curl "http://localhost:3000/api/shuffle/full?userId=your-user-id&platforms=netflix,hulu"

# Test leaderboard
curl "http://localhost:3000/api/leaderboard?month=12&year=2024"

# Test monthly recap
curl "http://localhost:3000/api/recap/monthly?userId=your-user-id&month=12&year=2024"
```

## 📊 Add Sample Data (Optional)

To test with sample data, uncomment the sample data section in `supabase-schema.sql` before running it.

## 🔄 Next Steps

1. **Authentication**: Implement proper user authentication
2. **Content Import**: Set up automated content discovery from TMDB
3. **Platform Integration**: Connect to streaming service APIs
4. **User Interface**: Connect the frontend to the new APIs

## 🛠️ API Endpoints

### Authentication Required Endpoints:
- `GET /api/shuffle/full` - Get random content
- `GET /api/shuffle/list` - Shuffle user lists
- `GET /api/leaderboard` - Get rankings
- `GET /api/recap/monthly` - Get monthly statistics

### How to Connect Frontend:
1. Update the existing components to call these APIs
2. Pass user ID as query parameter (temporary - implement proper auth later)
3. Handle loading states and errors
4. Display the returned data in the UI

## 🔒 Security Notes

**Important**: This setup uses simplified authentication for testing. For production:

1. Implement proper JWT token validation
2. Use Supabase Row Level Security
3. Add rate limiting
4. Validate all user inputs
5. Use environment variables for sensitive data

## 📝 Testing Checklist

- [ ] Database schema deployed successfully
- [ ] Environment variables configured
- [ ] Application starts without errors
- [ ] API endpoints respond correctly
- [ ] Supabase authentication works
- [ ] Sample data loaded (if applicable)

## 🆘 Troubleshooting

### Common Issues:

**Database Connection Errors:**
- Check your Supabase URL and keys
- Ensure your project is not paused
- Verify RLS policies are correctly set

**API Errors:**
- Check browser network tab for detailed error messages
- Ensure all required environment variables are set
- Verify API endpoints are accessible

**CORS Issues:**
- Ensure your domain is whitelisted in Supabase
- Check browser console for CORS error details

Need help? Check the error logs in your terminal and browser console for detailed information. 