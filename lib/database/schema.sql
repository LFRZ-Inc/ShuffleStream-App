-- ShuffleStream Database Schema
-- PostgreSQL compatible schema for all application features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar TEXT,
    bio TEXT,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    subscription VARCHAR(20) DEFAULT 'free' CHECK (subscription IN ('free', 'premium')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Cultural content preferences
    pride_content BOOLEAN DEFAULT TRUE,
    religious_content BOOLEAN DEFAULT TRUE,
    political_content BOOLEAN DEFAULT TRUE,
    social_justice_content BOOLEAN DEFAULT TRUE,
    mature_content BOOLEAN DEFAULT FALSE,
    international_content BOOLEAN DEFAULT TRUE,
    
    -- Platform preferences
    netflix BOOLEAN DEFAULT FALSE,
    disney BOOLEAN DEFAULT FALSE,
    hulu BOOLEAN DEFAULT FALSE,
    hbo_max BOOLEAN DEFAULT FALSE,
    amazon_prime BOOLEAN DEFAULT FALSE,
    apple_tv BOOLEAN DEFAULT FALSE,
    peacock BOOLEAN DEFAULT FALSE,
    paramount BOOLEAN DEFAULT FALSE,
    
    -- Viewing preferences
    autoplay BOOLEAN DEFAULT TRUE,
    skip_intros BOOLEAN DEFAULT FALSE,
    skip_credits BOOLEAN DEFAULT FALSE,
    subtitles BOOLEAN DEFAULT FALSE,
    audio_description BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_quality VARCHAR(10) DEFAULT 'auto',
    dark_mode BOOLEAN DEFAULT TRUE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    new_releases BOOLEAN DEFAULT TRUE,
    recommendations BOOLEAN DEFAULT TRUE,
    friend_activity BOOLEAN DEFAULT TRUE,
    achievements BOOLEAN DEFAULT TRUE,
    weekly_recap BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Privacy preferences
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
    show_watch_history BOOLEAN DEFAULT TRUE,
    show_favorites BOOLEAN DEFAULT TRUE,
    allow_friend_requests BOOLEAN DEFAULT TRUE,
    share_viewing_activity BOOLEAN DEFAULT TRUE,
    data_collection BOOLEAN DEFAULT TRUE,
    
    -- Shuffle preferences
    default_mode VARCHAR(20) DEFAULT 'full' CHECK (default_mode IN ('full', 'preference', 'show', 'list', 'platform')),
    exclude_watched BOOLEAN DEFAULT FALSE,
    favorite_genres TEXT[], -- Array of genre names
    avoid_genres TEXT[], -- Array of genre names to avoid
    max_runtime INTEGER DEFAULT 180, -- in minutes
    min_rating DECIMAL(2,1) DEFAULT 0.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stats table
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_watch_time INTEGER DEFAULT 0, -- in minutes
    total_titles INTEGER DEFAULT 0,
    average_session_time INTEGER DEFAULT 0, -- in minutes
    longest_session INTEGER DEFAULT 0, -- in minutes
    streak_days INTEGER DEFAULT 0,
    favorite_genre VARCHAR(50),
    favorite_day VARCHAR(10),
    favorite_time VARCHAR(10),
    level INTEGER DEFAULT 1,
    achievements TEXT[], -- Array of achievement IDs
    rank INTEGER DEFAULT 0,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platforms table
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    logo TEXT,
    base_url TEXT,
    deep_link_pattern TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cultural tags table
CREATE TABLE cultural_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('pride', 'religious', 'political', 'social-justice', 'cultural')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('movie', 'tv', 'documentary', 'special')),
    description TEXT,
    genres TEXT[], -- Array of genre names
    release_date DATE,
    runtime INTEGER, -- in minutes
    rating DECIMAL(2,1),
    age_rating VARCHAR(10),
    language VARCHAR(10),
    country VARCHAR(10),
    poster TEXT,
    backdrop TEXT,
    trailer TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'flagged', 'removed')),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    reports INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content platforms junction table
CREATE TABLE content_platforms (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, platform_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content cultural tags junction table
CREATE TABLE content_cultural_tags (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    cultural_tag_id UUID REFERENCES cultural_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, cultural_tag_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cast members table
CREATE TABLE cast_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    character VARCHAR(255),
    profile_image TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew members table
CREATE TABLE crew_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(100),
    department VARCHAR(100),
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seasons table
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    name VARCHAR(255),
    description TEXT,
    episode_count INTEGER DEFAULT 0,
    air_date DATE,
    poster TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Episodes table
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    name VARCHAR(255),
    description TEXT,
    air_date DATE,
    runtime INTEGER, -- in minutes
    still_image TEXT,
    rating DECIMAL(2,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User lists table
CREATE TABLE user_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Array of tag names
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User list content junction table
CREATE TABLE user_list_content (
    list_id UUID REFERENCES user_lists(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (list_id, content_id)
);

-- User list collaborators table
CREATE TABLE user_list_collaborators (
    list_id UUID REFERENCES user_lists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(20) DEFAULT 'view' CHECK (permission IN ('view', 'edit', 'admin')),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (list_id, user_id)
);

-- Shuffle packs table
CREATE TABLE shuffle_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    theme VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Array of tag names
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    uses INTEGER DEFAULT 0
);

-- Shuffle pack content junction table
CREATE TABLE shuffle_pack_content (
    pack_id UUID REFERENCES shuffle_packs(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pack_id, content_id)
);

-- Shuffle pack likes table
CREATE TABLE shuffle_pack_likes (
    pack_id UUID REFERENCES shuffle_packs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    liked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pack_id, user_id)
);

-- Viewing sessions table
CREATE TABLE viewing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER, -- in minutes
    progress DECIMAL(5,2), -- percentage 0-100
    platform VARCHAR(100),
    device_type VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watch history table
CREATE TABLE watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    watched_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    progress DECIMAL(5,2), -- percentage 0-100
    platform VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shuffle history table
CREATE TABLE shuffle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    shuffle_mode VARCHAR(20),
    reason TEXT,
    confidence DECIMAL(3,2), -- 0.00 to 1.00
    shuffled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    was_watched BOOLEAN DEFAULT FALSE
);

-- Friendships table
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- User activity table
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('watched', 'rated', 'reviewed', 'added_to_list', 'achievement')),
    content_id UUID REFERENCES content(id) ON DELETE SET NULL,
    data JSONB, -- Flexible data storage
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon TEXT,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria JSONB, -- Flexible criteria storage
    points INTEGER DEFAULT 0,
    unlocked_by INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table
CREATE TABLE user_achievements (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Content reports table
CREATE TABLE content_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_date TIMESTAMP,
    resolution TEXT
);

-- User reports table
CREATE TABLE user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_date TIMESTAMP,
    action VARCHAR(100)
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('super_admin', 'content_moderator', 'user_moderator', 'analytics_viewer')),
    permissions TEXT[], -- Array of permission names
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type VARCHAR(50) DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics tables
CREATE TABLE platform_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    total_watch_time INTEGER DEFAULT 0, -- in minutes
    unique_users INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform_id, date)
);

CREATE TABLE content_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0, -- in minutes
    completion_rate DECIMAL(5,2) DEFAULT 0.0, -- percentage
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    demographics JSONB, -- Age groups, genders, regions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_id, date)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_genres ON content USING GIN(genres);
CREATE INDEX idx_content_rating ON content(rating);
CREATE INDEX idx_viewing_sessions_user_id ON viewing_sessions(user_id);
CREATE INDEX idx_viewing_sessions_content_id ON viewing_sessions(content_id);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_content_id ON watch_history(content_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(type);
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_shuffle_history_user_id ON shuffle_history(user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON platforms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_viewing_sessions_updated_at BEFORE UPDATE ON viewing_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_watch_history_updated_at BEFORE UPDATE ON watch_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 