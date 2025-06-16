-- ShuffleStream Database Schema
-- Deploy this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences for cultural content
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  show_pride_content BOOLEAN DEFAULT FALSE,
  show_religious_content BOOLEAN DEFAULT FALSE,
  show_political_content BOOLEAN DEFAULT FALSE,
  show_social_justice_content BOOLEAN DEFAULT FALSE,
  show_thematic_ui BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User streaming platform subscriptions
CREATE TABLE public.user_platforms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL, -- netflix, disney+, hulu, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- Content titles metadata
CREATE TABLE public.titles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tmdb_id TEXT UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- movie, tv_show, episode
  release_year INTEGER,
  runtime_minutes INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  description TEXT,
  genres TEXT[],
  cultural_tags TEXT[], -- pride, religious, political, social_justice
  imdb_rating DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform availability for titles
CREATE TABLE public.title_platforms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_id UUID REFERENCES public.titles(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL,
  deep_link_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(title_id, platform_id)
);

-- User watch history
CREATE TABLE public.watched_titles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title_id UUID REFERENCES public.titles(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  watch_duration_minutes INTEGER,
  completed BOOLEAN DEFAULT FALSE
);

-- User created shuffle packs/lists
CREATE TABLE public.shuffle_packs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  title_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly leaderboard data
CREATE TABLE public.leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  titles_watched INTEGER DEFAULT 0,
  total_watch_time_minutes INTEGER DEFAULT 0,
  favorite_genre TEXT,
  rank_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- User yearly/monthly recap data
CREATE TABLE public.recap_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL, -- monthly, yearly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_titles_watched INTEGER DEFAULT 0,
  total_watch_time_minutes INTEGER DEFAULT 0,
  favorite_title_id UUID REFERENCES public.titles(id),
  top_genres TEXT[],
  top_platforms TEXT[],
  binger_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_type, period_start, period_end)
);

-- User achievements and badges
CREATE TABLE public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- binger_level, genre_master, platform_explorer
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- User friendships/social connections
CREATE TABLE public.friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Activity feed for social features
CREATE TABLE public.user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- watched, rated, created_pack, achievement
  title_id UUID REFERENCES public.titles(id),
  metadata JSONB, -- flexible data for different activity types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies

-- Users can only see and edit their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- User preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- User platforms
ALTER TABLE public.user_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own platforms" ON public.user_platforms FOR ALL USING (auth.uid() = user_id);

-- Titles are public readable
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Titles are publicly readable" ON public.titles FOR SELECT USING (true);

-- Title platforms are public readable
ALTER TABLE public.title_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Title platforms are publicly readable" ON public.title_platforms FOR SELECT USING (true);

-- Watch history is private
ALTER TABLE public.watched_titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own watch history" ON public.watched_titles FOR ALL USING (auth.uid() = user_id);

-- Shuffle packs
ALTER TABLE public.shuffle_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own packs" ON public.shuffle_packs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public packs are readable" ON public.shuffle_packs FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Leaderboard is public readable
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard is publicly readable" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "Users can update own leaderboard data" ON public.leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard data" ON public.leaderboard FOR UPDATE USING (auth.uid() = user_id);

-- Recap data is private
ALTER TABLE public.recap_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own recap data" ON public.recap_data FOR ALL USING (auth.uid() = user_id);

-- User achievements are private
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own friendships" ON public.friendships FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view relevant activities" ON public.user_activities FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT friend_id FROM public.friendships 
    WHERE user_id = public.user_activities.user_id AND status = 'accepted'
  )
);

-- Functions and triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sample data for testing (optional)
-- Uncomment to insert sample titles

/*
INSERT INTO public.titles (tmdb_id, title, type, release_year, genres, cultural_tags, poster_url) VALUES
('550', 'Fight Club', 'movie', 1999, ARRAY['drama', 'thriller'], ARRAY[], 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
('238', 'The Godfather', 'movie', 1972, ARRAY['crime', 'drama'], ARRAY[], 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'),
('157336', 'Interstellar', 'movie', 2014, ARRAY['adventure', 'drama', 'sci-fi'], ARRAY[], 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg');

INSERT INTO public.title_platforms (title_id, platform_id, deep_link_url) 
SELECT id, 'netflix', 'https://www.netflix.com/title/' || tmdb_id 
FROM public.titles 
WHERE tmdb_id IN ('550', '238', '157336');
*/ 