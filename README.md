# Local Services Finder

A cross-platform mobile app built with **React Native + Expo** to discover nearby local services such as plumbers, electricians, tutors, cleaners, painters, and mechanics.

The app focuses on modern UI/UX, smooth animations, and real-time location-aware service discovery.

## Project Overview

Local Services Finder helps users:
- Discover nearby service providers based on live location
- Select a custom search area on map to explore services in other locations
- Browse service cards with rating, distance, category, and pricing in INR (`₹`)
- View service details and initiate direct call actions

## What Problem It Solves

Traditional local-service discovery methods are often:
- Static or directory-like
- Hard to filter by relevance and distance
- Not designed for mobile-first real-time location use

This app improves that by combining:
- **Live geolocation + map-based discovery**
- **Custom area selection** for sparse locations
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

### Data Source
- **OpenStreetMap Overpass API** (live nearby service entities)

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
- Categories: plumber, electrician, tutor, cleaner, painter, mechanic
- Search by name/category/address
- Sort by top rated, nearest, best value

### 5. Tutor Result Capping
- Tutor category is intentionally limited to **nearest 5 results** for cleaner relevance

### 6. INR Pricing
- Service prices displayed in Indian Rupees (`₹`)
- Price sorting works on numeric INR values

### 7. Polished UX
- Animated search bar interactions
- Card press micro-interactions
- Staggered/fade list animations
- Parallax-style detail header motion
- Consistent spacing, rounded surfaces, and elevation

## App Screens

- **Home Screen**
  - Search bar
  - Category chips
  - Featured + Nearby sections

- **Service List Screen**
  - Full list with filters and sorting
  - Pull-to-refresh

- **Service Detail Screen**
  - Hero image
  - Ratings/meta/details
  - Call + Book buttons

- **Map Screen**
  - Live provider markers
  - Custom location selection + apply/reset controls

- **Profile Screen**
  - User details
  - Saved services preview

## Folder Structure

```text
components/      Reusable UI building blocks
constants/       Theme tokens (colors, spacing, radius, shadows)
context/         Shared app state (services, source, location flow)
data/            Live data adapter + fallback/mock data + helpers
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
- Modern mobile UX with motion and interaction polish
- Shared state architecture that updates all screens consistently
- Practical fallback strategy for API/network instability

## Future Enhancements

- Save/favorite persistence using AsyncStorage
- Booking workflow integration
- Chat/WhatsApp contact actions
- Backend integration for verified providers and user auth
- Place search (type city/locality and jump on map)

