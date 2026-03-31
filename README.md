# Local Services Finder

A cross-platform mobile app built with **React Native + Expo** to discover nearby local services such as plumbers, electricians, tutors, cleaners, painters, mechanics, and more.

The app focuses on modern UI/UX, smooth animations, and real-time location-aware service discovery.

## Project Overview

Local Services Finder helps users:
- Discover nearby service providers based on live location
- Select a custom search area on map to explore services in other locations
- Browse service cards with rating, distance, category, trust score, and pricing in INR (`₹`)
- View service details and initiate direct call actions
- Use AI issue classification to map user problems to the right service category

## What Problem It Solves

Traditional local-service discovery methods are often:
- Static or directory-like
- Hard to filter by relevance and distance
- Not designed for mobile-first real-time location use

This app improves that by combining:
- **Live geolocation + map-based discovery**
- **Custom area selection** for sparse locations
- **AI-assisted issue-to-service classification**
- **Trust/safety signal scoring** for provider confidence
- **Modern, high-polish mobile UX** with reusable architecture

## Tech Stack

### Core
- **Expo SDK 54**
- **React Native**
- **React 19**

### Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`

### UI / Motion
- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-linear-gradient`
- `@expo-google-fonts/manrope`

### Maps / Location
- `react-native-maps`
- `expo-location`

### Data Sources
- **OpenStreetMap Overpass API** (live nearby service entities)
- **External AI API (OpenAI-compatible)** for issue classification

## Key Features

### 1. Real-time Service Discovery
- Fetches nearby services using current GPS location
- Falls back to local mock data when live API is unavailable

### 2. Custom Location Search (Map)
- User can move/long-press map to choose any area
- Tap **Apply Area** to refresh services around selected location
- **Use My Current Location** to reset to device location

### 3. Smart Radius Strategy
- Primary live fetch radius: **7 km**
- If results are sparse, auto-expands to **14 km**

### 4. Category + Search + Sort
- Categories include plumber, electrician, tutor, cleaner, painter, mechanic, carpenter, AC repair, pest control, beauty salon, mover, appliance repair
- Search by name/category/address
- Sort by top rated, nearest, best value

### 5. Tutor Result Capping
- Tutor category is intentionally limited to **nearest 5 results** for cleaner relevance

### 6. INR Pricing
- Service prices displayed in Indian Rupees (`₹`)
- Price sorting works on numeric INR values

### 7. AI Issue Classifier
- User describes issue (e.g. "AC not cooling")
- App classifies best category, urgency, and confidence
- Uses external AI API when key is configured
- Falls back to local rule-based classifier if external AI is unavailable

### 8. Safety / Trust Signals
- Each listing gets a trust score and level using rating/reviews/contact/address/source checks
- Trust badges shown on cards and details

### 9. Dark / Light Theme Toggle
- In-app appearance toggle from Profile screen

## App Screens

- **Home Screen**
  - Search bar
  - AI issue classifier input
  - Category chips
  - Featured + Nearby sections

- **Service List Screen**
  - Full list with filters and sorting
  - Pull-to-refresh

- **Service Detail Screen**
  - Hero image
  - Ratings/meta/details
  - Trust/safety panel
  - Call + Book buttons

- **Map Screen**
  - Live provider markers
  - Custom location selection + apply/reset controls

- **Profile Screen**
  - User details
  - Theme toggle
  - Saved services preview

## Folder Structure

```text
components/      Reusable UI building blocks
constants/       Theme tokens (colors, spacing, radius, shadows)
context/         Shared app state (services, source, location flow, theme)
data/            Live data adapter + AI + fallback/mock data + helpers
hooks/           Reusable hooks (location)
navigation/      Stack + tab navigation setup
screens/         Feature screens
```

## Setup Instructions

### Prerequisites
- Node.js (LTS recommended)
- npm
- Expo Go app on iOS/Android

### Install

```bash
cd /Users/g.o.a.t/Desktop/LocalServicesApp
npm install
```

### Configure External AI API

1. Copy env template:
```bash
cp .env.example .env
```

2. Set your key in `.env`:
- `EXPO_PUBLIC_AI_API_KEY`
- optional: `EXPO_PUBLIC_AI_BASE_URL` (OpenAI-compatible base URL)
- optional: `EXPO_PUBLIC_AI_MODEL`

If no key is configured, classifier still works using local fallback rules.

### Run (recommended)

```bash
npx expo start --lan -c
```

If LAN has connectivity issues, use tunnel:

```bash
npx expo start --tunnel -c
```

### Open on Phone
1. Install **Expo Go**
2. Ensure phone and laptop are on same Wi-Fi (for LAN mode)
3. Scan QR code from terminal

## Troubleshooting

### Could not connect to development server
- Stop old processes and restart Expo with `-c`
- Force close and reopen Expo Go
- Re-scan latest QR (avoid old cached project session)
- In iPhone settings, allow Expo Go:
  - Local Network
  - Cellular Data (optional)

### Tunnel install issue (`@expo/ngrok`)
If tunnel fails due to global npm permission:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
npm install -g @expo/ngrok@^4.1.0
```

## GitHub Publishing

```bash
cd /Users/g.o.a.t/Desktop/LocalServicesApp
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Current User Profile in App
- Name: **Krish**
- Email: **rawatkrish48@gmail.com**

## How It Is Different from Traditional Apps

- Real-time location-aware discovery instead of static directory listing
- Map-driven custom area search for user-controlled service exploration
- AI-assisted issue classification for faster problem resolution
- Trust/safety scoring for listing quality confidence
- Modern mobile UX with motion and interaction polish
- Shared state architecture that updates all screens consistently
- Practical fallback strategy for API/network instability

## Future Enhancements

- Save/favorite persistence using AsyncStorage
- Booking workflow integration
- Chat/WhatsApp contact actions
- Backend integration for verified providers and user auth
- Place search (type city/locality and jump on map)
