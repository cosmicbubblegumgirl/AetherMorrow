export const tones = [
  { id: 'luminous', name: 'Luminous', note: 'Warmer, brighter, sunnier moods' },
  { id: 'balanced', name: 'Balanced', note: 'Practical, even-handed conditions' },
  { id: 'misty', name: 'Misty', note: 'Cooler, softer, more overcast days' },
  { id: 'dramatic', name: 'Dramatic', note: 'Windier, wetter, more theatrical skies' }
];

export const worldDestinations = [
  { city: 'Ramsgate', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Margate', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Southbroom', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Uvongo', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Port Edward', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Durban', country: 'South Africa', region: 'Africa', climateKey: 'kzn-coast' },
  { city: 'Cape Town', country: 'South Africa', region: 'Africa', climateKey: 'cape-town' },
  { city: 'Nairobi', country: 'Kenya', region: 'Africa', climateKey: 'east-africa' },
  { city: 'Cairo', country: 'Egypt', region: 'Africa', climateKey: 'north-africa' },
  { city: 'Marrakech', country: 'Morocco', region: 'Africa', climateKey: 'north-africa' },
  { city: 'Edinburgh', country: 'Scotland', region: 'Europe', climateKey: 'cool-europe' },
  { city: 'London', country: 'England', region: 'Europe', climateKey: 'cool-europe' },
  { city: 'Paris', country: 'France', region: 'Europe', climateKey: 'temperate-europe' },
  { city: 'Rome', country: 'Italy', region: 'Europe', climateKey: 'warm-europe' },
  { city: 'Barcelona', country: 'Spain', region: 'Europe', climateKey: 'warm-europe' },
  { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', climateKey: 'cool-europe' },
  { city: 'Prague', country: 'Czech Republic', region: 'Europe', climateKey: 'temperate-europe' },
  { city: 'Vienna', country: 'Austria', region: 'Europe', climateKey: 'temperate-europe' },
  { city: 'Reykjavík', country: 'Iceland', region: 'Europe', climateKey: 'nordic' },
  { city: 'Kyoto', country: 'Japan', region: 'Asia', climateKey: 'east-asia' },
  { city: 'Tokyo', country: 'Japan', region: 'Asia', climateKey: 'east-asia' },
  { city: 'Seoul', country: 'South Korea', region: 'Asia', climateKey: 'east-asia' },
  { city: 'Singapore', country: 'Singapore', region: 'Asia', climateKey: 'tropical-asia' },
  { city: 'Bangkok', country: 'Thailand', region: 'Asia', climateKey: 'tropical-asia' },
  { city: 'Bali', country: 'Indonesia', region: 'Asia', climateKey: 'tropical-asia' },
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', climateKey: 'desert' },
  { city: 'New York', country: 'United States', region: 'North America', climateKey: 'temperate-north-america' },
  { city: 'San Francisco', country: 'United States', region: 'North America', climateKey: 'pacific' },
  { city: 'Seattle', country: 'United States', region: 'North America', climateKey: 'pacific' },
  { city: 'Vancouver', country: 'Canada', region: 'North America', climateKey: 'pacific' },
  { city: 'Toronto', country: 'Canada', region: 'North America', climateKey: 'temperate-north-america' },
  { city: 'Mexico City', country: 'Mexico', region: 'North America', climateKey: 'highland' },
  { city: 'Havana', country: 'Cuba', region: 'North America', climateKey: 'caribbean' },
  { city: 'Rio de Janeiro', country: 'Brazil', region: 'South America', climateKey: 'coastal-south-america' },
  { city: 'Buenos Aires', country: 'Argentina', region: 'South America', climateKey: 'temperate-south-america' },
  { city: 'Lima', country: 'Peru', region: 'South America', climateKey: 'coastal-south-america' },
  { city: 'Santiago', country: 'Chile', region: 'South America', climateKey: 'temperate-south-america' },
  { city: 'Sydney', country: 'Australia', region: 'Oceania', climateKey: 'oceania-coast' },
  { city: 'Melbourne', country: 'Australia', region: 'Oceania', climateKey: 'oceania-coast' },
  { city: 'Auckland', country: 'New Zealand', region: 'Oceania', climateKey: 'oceania-coast' },
  { city: 'Queenstown', country: 'New Zealand', region: 'Oceania', climateKey: 'cool-oceania' },
  { city: 'Honolulu', country: 'United States', region: 'Oceania', climateKey: 'pacific-island' }
];

export const featuredWorldStops = [
  'Ramsgate',
  'Margate',
  'Cape Town',
  'Edinburgh',
  'Paris',
  'Rome',
  'Kyoto',
  'Singapore',
  'New York',
  'Rio de Janeiro',
  'Sydney',
  'Queenstown'
];

export const climateProfiles = {
  'kzn-coast': { baseTemp: 24, rain: 22, wind: 16, label: 'Warm Indian Ocean coast' },
  'cape-town': { baseTemp: 20, rain: 18, wind: 20, label: 'Breezy Atlantic edge' },
  'east-africa': { baseTemp: 22, rain: 24, wind: 12, label: 'Sunny highland rhythm' },
  'north-africa': { baseTemp: 28, rain: 8, wind: 14, label: 'Dry golden heat' },
  'cool-europe': { baseTemp: 14, rain: 30, wind: 16, label: 'Cool city weather' },
  'temperate-europe': { baseTemp: 17, rain: 24, wind: 14, label: 'Classic spring balance' },
  'warm-europe': { baseTemp: 21, rain: 18, wind: 12, label: 'Bright Mediterranean tilt' },
  nordic: { baseTemp: 9, rain: 28, wind: 18, label: 'Crisp northern air' },
  'east-asia': { baseTemp: 20, rain: 26, wind: 13, label: 'Layered urban weather' },
  'tropical-asia': { baseTemp: 30, rain: 34, wind: 12, label: 'Humid tropical bloom' },
  desert: { baseTemp: 33, rain: 4, wind: 12, label: 'Dry and sunlit' },
  'temperate-north-america': { baseTemp: 18, rain: 24, wind: 15, label: 'Four-season city rhythm' },
  pacific: { baseTemp: 16, rain: 30, wind: 15, label: 'Soft marine layer' },
  highland: { baseTemp: 21, rain: 18, wind: 13, label: 'High-altitude balance' },
  caribbean: { baseTemp: 29, rain: 28, wind: 14, label: 'Warm sea breeze' },
  'coastal-south-america': { baseTemp: 24, rain: 22, wind: 14, label: 'Coastal warmth' },
  'temperate-south-america': { baseTemp: 19, rain: 20, wind: 13, label: 'Mild southern city air' },
  'oceania-coast': { baseTemp: 22, rain: 21, wind: 16, label: 'Coastal antipodean mix' },
  'cool-oceania': { baseTemp: 13, rain: 18, wind: 14, label: 'Alpine clarity' },
  'pacific-island': { baseTemp: 29, rain: 20, wind: 14, label: 'Island warmth' },
  fallback: { baseTemp: 20, rain: 20, wind: 14, label: 'Adaptable global weather' }
};

export const skyLibrary = [
  { id: 'sunlit', label: 'Sunlit Spell', summary: 'Bright skies and excellent outdoor charm.', icon: 'Sun' },
  { id: 'partly', label: 'Cloudlace', summary: 'Pleasant light with passing cloud ribbons.', icon: 'CloudSun' },
  { id: 'rain', label: 'Silver Rain', summary: 'Gentle showers favour cosy indoor plans.', icon: 'CloudRain' },
  { id: 'storm', label: 'Tempest Opera', summary: 'Moody skies call for caution and polished backup plans.', icon: 'CloudLightning' },
  { id: 'moonlit', label: 'Moonlit Quiet', summary: 'Cool air and calmer evening potential.', icon: 'MoonStar' }
];

export const activities = [
  {
    id: 'coastal-fishing',
    name: 'Coastal Fishing',
    icon: 'Fish',
    kind: 'outdoor',
    idealTemp: [18, 27],
    maxPrecip: 28,
    maxWind: 22,
    favoriteSkies: ['partly', 'moonlit', 'sunlit'],
    description: 'A tide-chasing outing for calmer winds, cleaner water, and patient optimism.',
    tip: 'Fishing improves when wind behaves and the weather keeps its theatrics modest.'
  },
  {
    id: 'pier-rocks',
    name: 'Pier & Rocks',
    icon: 'Waves',
    kind: 'outdoor',
    idealTemp: [17, 26],
    maxPrecip: 22,
    maxWind: 18,
    favoriteSkies: ['partly', 'moonlit'],
    description: 'Best for breezy-but-not-too-breezy coastal sessions near accessible structure.',
    tip: 'This one rewards steady conditions and lower gusts.'
  },
  {
    id: 'garden-walk',
    name: 'Garden Walk',
    icon: 'Trees',
    kind: 'outdoor',
    idealTemp: [14, 24],
    maxPrecip: 20,
    maxWind: 24,
    favoriteSkies: ['sunlit', 'partly', 'moonlit'],
    description: 'A slow, elegant wander among leaves and little discoveries.',
    tip: 'Comfortable shoes and a curious eye recommended.'
  },
  {
    id: 'market-stroll',
    name: 'Market Stroll',
    icon: 'Compass',
    kind: 'mixed',
    idealTemp: [13, 24],
    maxPrecip: 30,
    maxWind: 28,
    favoriteSkies: ['partly', 'sunlit'],
    description: 'Perfect for cafés, little stalls, and lingering in style.',
    tip: 'Keep a tote and a backup umbrella close.'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'Bike',
    kind: 'outdoor',
    idealTemp: [14, 22],
    maxPrecip: 15,
    maxWind: 20,
    favoriteSkies: ['sunlit', 'partly'],
    description: 'Best when the air is brisk and the roads feel light.',
    tip: 'Wind matters more than whimsy here.'
  },
  {
    id: 'picnic',
    name: 'Picnic',
    icon: 'Tent',
    kind: 'outdoor',
    idealTemp: [18, 28],
    maxPrecip: 10,
    maxWind: 16,
    favoriteSkies: ['sunlit', 'partly'],
    description: 'A lavish blanket moment, only when the sky behaves.',
    tip: 'This is the fussiest darling in the planner.'
  },
  {
    id: 'gallery',
    name: 'Gallery Visit',
    icon: 'Palette',
    kind: 'indoor',
    idealTemp: [6, 34],
    maxPrecip: 100,
    maxWind: 42,
    favoriteSkies: ['rain', 'storm', 'partly', 'sunlit', 'moonlit'],
    description: 'An excellent rainy-day pivot with polished charm.',
    tip: 'Storms only improve the atmosphere.'
  },
  {
    id: 'cafe-journal',
    name: 'Café & Journal',
    icon: 'Coffee',
    kind: 'indoor',
    idealTemp: [6, 34],
    maxPrecip: 100,
    maxWind: 46,
    favoriteSkies: ['rain', 'storm', 'moonlit', 'partly'],
    description: 'A civilised answer to uncertain weather.',
    tip: 'Pairs beautifully with drizzle and pastries.'
  },
  {
    id: 'bookshop',
    name: 'Bookshop Hour',
    icon: 'BookOpen',
    kind: 'indoor',
    idealTemp: [6, 34],
    maxPrecip: 100,
    maxWind: 50,
    favoriteSkies: ['rain', 'storm', 'moonlit', 'partly', 'sunlit'],
    description: 'Always a wise choice, especially under cloud drama.',
    tip: 'Minimal weather risk. Maximal literary potential.'
  },
  {
    id: 'stargazing',
    name: 'Stargazing',
    icon: 'MoonStar',
    kind: 'outdoor',
    idealTemp: [10, 22],
    maxPrecip: 8,
    maxWind: 14,
    favoriteSkies: ['moonlit', 'sunlit'],
    description: 'Reserved for calm evenings and cooperative skies.',
    tip: 'Cloud cover is the true villain.'
  },
  {
    id: 'live-music',
    name: 'Live Music',
    icon: 'Music2',
    kind: 'mixed',
    idealTemp: [10, 30],
    maxPrecip: 60,
    maxWind: 28,
    favoriteSkies: ['partly', 'moonlit', 'rain'],
    description: 'Flexible, atmospheric, and reliably charming.',
    tip: 'A strong fallback when the day turns theatrical.'
  }
];

export const defaultSelectedActivities = [
  'coastal-fishing',
  'garden-walk',
  'market-stroll',
  'gallery',
  'cafe-journal',
  'stargazing'
];

export const moodNotes = [
  'The air feels polished and cooperative.',
  'A graceful day for plans with a little sparkle.',
  "Lovely, provided you respect the forecast's boundaries.",
  'A touch of drama in the sky keeps things interesting.',
  'Practical elegance is advised today.',
  'This forecast rewards flexibility and good footwear.'
];

export const fishingSpotLibrary = {
  Ramsgate: [
    { name: 'Ramsgate Main Beach', distance: '1 km', style: 'Surf casting', bestFor: 'kob, shad, bronze bream' },
    { name: 'Ramsgate Lagoon Mouth', distance: '2 km', style: 'Estuary edges', bestFor: 'grunter, small kingfish' },
    { name: 'Southbroom Rocks', distance: '8 km', style: 'Rocks & gullies', bestFor: 'game fish on clean water days' },
    { name: 'Port Edward Point', distance: '30 km', style: 'Rock ledges', bestFor: 'serious saltwater sessions' }
  ],
  Margate: [
    { name: 'Margate Pier Area', distance: '1 km', style: 'Easy-access shoreline', bestFor: 'shad, stumpnose' },
    { name: 'Uvongo Pier', distance: '4 km', style: 'Pier fishing', bestFor: 'light spinning and bait work' },
    { name: 'Lucien Beach Rocks', distance: '3 km', style: 'Rock and surf', bestFor: 'mixed species in calmer conditions' },
    { name: 'Ramsgate Main Beach', distance: '6 km', style: 'Surf casting', bestFor: 'kob, bream, shad' }
  ],
  Durban: [
    { name: 'Blue Lagoon', distance: '4 km', style: 'Harbour mouth edges', bestFor: 'edibles and light tackle' },
    { name: 'uShaka Pier', distance: '3 km', style: 'Pier fishing', bestFor: 'easy-access sessions' },
    { name: 'Umhlanga Rocks', distance: '18 km', style: 'Rocks', bestFor: 'game fish windows' }
  ],
  'Cape Town': [
    { name: 'Mouille Point', distance: '3 km', style: 'Promenade casting', bestFor: 'light spinning' },
    { name: 'False Bay Reefs', distance: '25 km', style: 'Boat / shore mix', bestFor: 'varied coastal species' },
    { name: 'Kalk Bay Harbour', distance: '28 km', style: 'Harbour walls', bestFor: 'accessible angling' }
  ],
  defaultSouthAfrica: [
    { name: 'Local main beach or pier', distance: 'Nearby', style: 'Shoreline scouting', bestFor: 'short-session fishing' },
    { name: 'Nearest estuary mouth', distance: 'Within 15 km', style: 'Tidal edges', bestFor: 'calmer-water alternatives' },
    { name: 'Rocky point outside town', distance: 'Within 25 km', style: 'Rocks', bestFor: 'clean-water days' }
  ],
  global: [
    { name: 'Local waterfront promenade', distance: 'Nearby', style: 'Urban shoreline', bestFor: 'short golden-hour sessions' },
    { name: 'Nearest marina or jetty', distance: 'Within 10 km', style: 'Structured access', bestFor: 'easy setup days' },
    { name: 'Regional estuary or bay', distance: 'Within 25 km', style: 'Protected water', bestFor: 'lower-wind alternatives' }
  ]
};
