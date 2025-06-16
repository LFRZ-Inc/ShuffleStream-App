-- Sample data for ShuffleStream database
-- Run this after setting up the schema to test the application

-- Insert streaming platforms
INSERT INTO platforms (id, name, color, icon, base_url) VALUES
('netflix', 'Netflix', '#E50914', '🔴', 'https://netflix.com'),
('disney', 'Disney+', '#113CCF', '🏰', 'https://disneyplus.com'),
('hulu', 'Hulu', '#1CE783', '🟢', 'https://hulu.com'),
('prime', 'Prime Video', '#00A8E1', '📦', 'https://primevideo.com'),
('hbo', 'HBO Max', '#7C3AED', '🎭', 'https://hbomax.com'),
('paramount', 'Paramount+', '#0068EF', '⛰️', 'https://paramountplus.com'),
('peacock', 'Peacock', '#FD7E14', '🦚', 'https://peacocktv.com'),
('appletv', 'Apple TV+', '#000000', '🍎', 'https://tv.apple.com');

-- Insert sample titles with TMDB IDs
INSERT INTO titles (id, title, description, genre, rating, duration, release_year, poster_url, trailer_url, tmdb_id, type, cultural_content) VALUES
-- Movies
('title_1', 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', ARRAY['Action', 'Crime', 'Drama'], 'PG-13', 152, 2008, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://youtube.com/watch?v=EXeTwQWrcwY', 155, 'movie', ARRAY[]::text[]),
('title_2', 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', ARRAY['Action', 'Sci-Fi', 'Thriller'], 'PG-13', 148, 2010, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'https://youtube.com/watch?v=YoHD9XEInc0', 27205, 'movie', ARRAY[]::text[]),
('title_3', 'Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', ARRAY['Comedy', 'Drama', 'Thriller'], 'R', 132, 2019, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'https://youtube.com/watch?v=5xH0HfJHsaY', 496243, 'movie', ARRAY[]::text[]),
('title_4', 'Black Panther', 'T''Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country''s past.', ARRAY['Action', 'Adventure', 'Sci-Fi'], 'PG-13', 134, 2018, 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', 'https://youtube.com/watch?v=xjDjIWPwcPU', 284054, 'movie', ARRAY[]::text[]),
('title_5', 'Moonlight', 'A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.', ARRAY['Drama'], 'R', 111, 2016, 'https://image.tmdb.org/t/p/w500/4911T5FbJ9eD2Faz5Z8cT3SUhU9.jpg', 'https://youtube.com/watch?v=9NJj12tJzqc', 376867, 'movie', ARRAY['social_justice']::text[]),
('title_6', 'Call Me by Your Name', 'In 1980s Italy, romance blossoms between a seventeen-year-old student and the older man hired as his father''s research assistant.', ARRAY['Drama', 'Romance'], 'R', 132, 2017, 'https://image.tmdb.org/t/p/w500/tcANhO3S7pJuULKX8bKK5hq8SQz.jpg', 'https://youtube.com/watch?v=Z9AYPxH5NTM', 398818, 'movie', ARRAY['pride']::text[]),
('title_7', 'The Passion of the Christ', 'Depicts the final twelve hours in the life of Jesus of Nazareth, on the day of his crucifixion in Jerusalem.', ARRAY['Drama'], 'R', 127, 2004, 'https://image.tmdb.org/t/p/w500/8yR8Rk7DP39RVfZ1hUOVsNZXvFp.jpg', 'https://youtube.com/watch?v=4Aif1qEB_JU', 8871, 'movie', ARRAY['religious']::text[]),
('title_8', 'JFK', 'New Orleans District Attorney Jim Garrison discovers there''s more to the Kennedy assassination than the official story.', ARRAY['Drama', 'History', 'Thriller'], 'R', 189, 1991, 'https://image.tmdb.org/t/p/w500/r0VWVTYlqdRCK5ZoOdNnHdqM2gt.jpg', 'https://youtube.com/watch?v=8rRNdlFM3xE', 9360, 'movie', ARRAY['political']::text[]),

-- TV Shows
('title_9', 'Stranger Things', 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', ARRAY['Drama', 'Fantasy', 'Horror'], 'TV-14', 50, 2016, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', 'https://youtube.com/watch?v=b9EkMc79ZSU', 66732, 'tv_show', ARRAY[]::text[]),
('title_10', 'The Crown', 'Follows the political rivalries and romance of Queen Elizabeth II''s reign and the events that shaped the second half of the twentieth century.', ARRAY['Biography', 'Drama', 'History'], 'TV-MA', 60, 2016, 'https://image.tmdb.org/t/p/w500/1M876KQUuMllmAcdff8aZSVzzk2.jpg', 'https://youtube.com/watch?v=JWtnJjn6ng0', 1399, 'tv_show', ARRAY[]::text[]),
('title_11', 'The Mandalorian', 'After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches, earning his keep as a bounty hunter.', ARRAY['Action', 'Adventure', 'Sci-Fi'], 'TV-PG', 40, 2019, 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', 'https://youtube.com/watch?v=aOC8E8z_ifw', 82856, 'tv_show', ARRAY[]::text[]),
('title_12', 'RuPaul''s Drag Race', 'RuPaul searches for America''s next drag superstar.', ARRAY['Reality'], 'TV-14', 60, 2009, 'https://image.tmdb.org/t/p/w500/6LThfVcGWSLswQaQh2vvk1Q2IoH.jpg', 'https://youtube.com/watch?v=1z-AxgueBRk', 67079, 'tv_show', ARRAY['pride']::text[]),
('title_13', 'The Chosen', 'A multi-season series about Jesus and those who knew Him. Set against the backdrop of Jewish oppression in first-century Israel.', ARRAY['Drama'], 'TV-PG', 55, 2017, 'https://image.tmdb.org/t/p/w500/9jYtfKuXR6QpKfqTKLqmhqPOmwf.jpg', 'https://youtube.com/watch?v=craeyJdrCsE', 85949, 'tv_show', ARRAY['religious']::text[]),
('title_14', 'House of Cards', 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.', ARRAY['Drama'], 'TV-MA', 50, 2013, 'https://image.tmdb.org/t/p/w500/hKWxWjFwnMvkWQawbhvC0Y7ygQ8.jpg', 'https://youtube.com/watch?v=ULwUzF1q5w4', 1399, 'tv_show', ARRAY['political']::text[]),
('title_15', 'When They See Us', 'Five teens from Harlem become trapped in a nightmare when they''re falsely accused of a brutal attack in Central Park.', ARRAY['Biography', 'Crime', 'Drama'], 'TV-MA', 75, 2019, 'https://image.tmdb.org/t/p/w500/8rSGJDaQ2NB4jYgQdpAWsUE2zYk.jpg', 'https://youtube.com/watch?v=_FXZYOuqx5E', 86831, 'tv_show', ARRAY['social_justice']::text[]);

-- Link titles to platforms
INSERT INTO title_platforms (title_id, platform_id, deep_link_url, is_available) VALUES
-- Netflix titles
('title_1', 'netflix', 'https://netflix.com/title/70079583', true),
('title_9', 'netflix', 'https://netflix.com/title/80057281', true),
('title_10', 'netflix', 'https://netflix.com/title/80025678', true),
('title_15', 'netflix', 'https://netflix.com/title/80200549', true),

-- Disney+ titles
('title_4', 'disney', 'https://disneyplus.com/movies/black-panther', true),
('title_11', 'disney', 'https://disneyplus.com/series/the-mandalorian', true),

-- HBO Max titles
('title_2', 'hbo', 'https://hbomax.com/movie/inception', true),
('title_3', 'hbo', 'https://hbomax.com/movie/parasite', true),

-- Hulu titles
('title_5', 'hulu', 'https://hulu.com/movie/moonlight', true),
('title_12', 'hulu', 'https://hulu.com/series/rupauls-drag-race', true),

-- Prime Video titles
('title_6', 'prime', 'https://primevideo.com/detail/call-me-by-your-name', true),
('title_7', 'prime', 'https://primevideo.com/detail/passion-of-christ', true),

-- Paramount+ titles
('title_8', 'paramount', 'https://paramountplus.com/movies/jfk', true),

-- Peacock titles
('title_13', 'peacock', 'https://peacocktv.com/watch-online/tv/the-chosen', true),

-- Apple TV+ titles
('title_14', 'appletv', 'https://tv.apple.com/us/show/house-of-cards', true);

-- Insert achievements
INSERT INTO achievements (id, title, description, icon, points_required, unlock_condition) VALUES
('first_shuffle', 'First Shuffle', 'Complete your first shuffle', '🎲', 0, 'shuffle_count >= 1'),
('movie_buff', 'Movie Buff', 'Watch 10 movies', '🎬', 100, 'movies_watched >= 10'),
('binge_master', 'Binge Master', 'Watch for 6+ hours in a single day', '⏰', 250, 'daily_watch_time >= 360'),
('genre_explorer', 'Genre Explorer', 'Watch content from 5 different genres', '🗺️', 150, 'genres_count >= 5'),
('platform_hopper', 'Platform Hopper', 'Use 3 different streaming platforms', '📺', 200, 'platforms_count >= 3'),
('consistency_king', 'Consistency King', 'Watch content for 7 days straight', '👑', 300, 'daily_streak >= 7'),
('early_bird', 'Early Bird', 'Watch something before 7 AM', '🌅', 50, 'early_morning_session = true'),
('night_owl', 'Night Owl', 'Watch something after 11 PM', '🦉', 50, 'late_night_session = true'),
('social_butterfly', 'Social Butterfly', 'Complete 5 social shuffles', '🦋', 175, 'social_shuffles >= 5'),
('mood_matcher', 'Mood Matcher', 'Complete 10 mood-based shuffles', '🎭', 125, 'mood_shuffles >= 10');

-- Insert cultural content tags
INSERT INTO cultural_content (title_id, content_type, description) VALUES
('title_5', 'social_justice', 'Explores themes of race, identity, and social inequality'),
('title_6', 'pride', 'LGBTQ+ romance and coming-of-age story'),
('title_7', 'religious', 'Christian religious content depicting the crucifixion of Jesus'),
('title_8', 'political', 'Political thriller about the JFK assassination conspiracy'),
('title_12', 'pride', 'LGBTQ+ reality competition celebrating drag culture'),
('title_13', 'religious', 'Christian series about the life of Jesus Christ'),
('title_14', 'political', 'Political drama about corruption in Washington D.C.'),
('title_15', 'social_justice', 'Addresses racial injustice and the criminal justice system');

-- This data will be used by the APIs to provide realistic shuffle results
-- and demonstrate all the features of ShuffleStream

COMMIT; 