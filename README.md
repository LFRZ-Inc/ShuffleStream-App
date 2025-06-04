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