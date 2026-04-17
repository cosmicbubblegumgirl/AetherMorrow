import { defaultSelectedActivities, moodNotes, skyLibrary } from './constants.js';
import { getClimateProfile } from './helpers.js';
import { buildRecommendations } from './scoringService.js';
import { clamp } from './helpers.js';

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function dayLabel(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function monthDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toneAdjustments(tone) {
  switch (tone) {
    case 'luminous':
      return { warmth: 3, rain: -10, wind: -2, cloudBias: -0.12 };
    case 'misty':
      return { warmth: -2, rain: 8, wind: 1, cloudBias: 0.12 };
    case 'dramatic':
      return { warmth: 0, rain: 16, wind: 6, cloudBias: 0.18 };
    default:
      return { warmth: 0, rain: 0, wind: 0, cloudBias: 0 };
  }
}

function chooseSky({ precip, wind, cloudiness, tempHigh }) {
  if (precip > 62 || wind > 30) return skyLibrary.find((item) => item.id === 'storm');
  if (precip > 35) return skyLibrary.find((item) => item.id === 'rain');
  if (cloudiness > 0.72) return skyLibrary.find((item) => item.id === 'moonlit');
  if (cloudiness > 0.42 || tempHigh < 14) return skyLibrary.find((item) => item.id === 'partly');
  if (tempHigh > 26) return skyLibrary.find((item) => item.id === 'sunlit');
  return skyLibrary.find((item) => item.id === 'partly');
}

export function generateForecast({ destination, startDate, tone = 'balanced' }) {
  const seed = hashString(`${destination}-${startDate}-${tone}`);
  const rng = createRng(seed);
  const start = new Date(`${startDate}T09:00:00`);
  const climate = getClimateProfile(destination);
  const { warmth, rain, wind, cloudBias } = toneAdjustments(tone);
  const baseTemp = climate.baseTemp + warmth + Math.floor(rng() * 4) - 1;

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const wave = Math.sin(index / 2.15) * 3.5;
    const tempHigh = Math.round(baseTemp + wave + rng() * 4.5);
    const tempLow = Math.round(tempHigh - (4 + rng() * 5));
    const precip = clamp(Math.round(rng() * 44 + climate.rain + rain + (index % 5 === 0 ? 6 : 0)), 0, 100);
    const windSpeed = clamp(Math.round(8 + rng() * 14 + climate.wind + wind - 10), 5, 42);
    const humidity = clamp(Math.round(48 + rng() * 32 + precip * 0.18), 35, 96);
    const uv = clamp(Math.round(3 + rng() * 6 + (tempHigh > 26 ? 1 : 0) - precip * 0.02), 1, 11);
    const cloudiness = clamp(rng() + cloudBias + precip / 150, 0, 1);
    const sky = chooseSky({ precip, wind: windSpeed, cloudiness, tempHigh });
    const readiness = clamp(Math.round(86 - precip * 0.4 - windSpeed * 0.55 + (tempHigh >= 18 && tempHigh <= 27 ? 10 : 0)), 20, 97);

    return {
      id: `${date.toISOString()}-${index}`,
      dateIso: date.toISOString(),
      label: dayLabel(date),
      shortDate: monthDay(date),
      dayNumber: date.getDate(),
      weekIndex: index < 7 ? 0 : 1,
      high: tempHigh,
      low: tempLow,
      precip,
      windSpeed,
      humidity,
      uv,
      cloudiness,
      readiness,
      skyId: sky.id,
      skyLabel: sky.label,
      skySummary: sky.summary,
      mood: moodNotes[Math.floor(rng() * moodNotes.length)]
    };
  });
}

export function getForecastResponse({ destination, startDate, tone, selectedActivities }) {
  const days = generateForecast({ destination, startDate, tone });
  const chosenActivities = selectedActivities?.length ? selectedActivities : defaultSelectedActivities;
  return buildRecommendations(days, chosenActivities);
}
