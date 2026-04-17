import { defaultSelectedActivities, moodNotes, skyLibrary } from './constants.js';
import { getClimateProfile } from './helpers.js';
import { buildRecommendations } from './scoringService.js';
import { clamp } from './helpers.js';

const OPEN_METEO_GEOCODE_URL = process.env.OPEN_METEO_GEOCODE_URL || 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_FORECAST_URL = process.env.OPEN_METEO_FORECAST_URL || 'https://api.open-meteo.com/v1/forecast';

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

function toDateOnly(value) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

function dateIsoOnly(date) {
  return date.toISOString().slice(0, 10);
}

function weatherCodeToSky(weatherCode, cloudiness) {
  if ([95, 96, 99].includes(weatherCode)) return 'storm';
  if (
    [
      51, 53, 55, 56, 57,
      61, 63, 65, 66, 67,
      80, 81, 82
    ].includes(weatherCode)
  ) {
    return 'rain';
  }
  if ([45, 48, 71, 73, 75, 77, 85, 86].includes(weatherCode) || cloudiness > 0.72) {
    return 'moonlit';
  }
  if ([0].includes(weatherCode) && cloudiness < 0.35) return 'sunlit';
  return 'partly';
}

function findSkyById(id) {
  return skyLibrary.find((item) => item.id === id) || skyLibrary.find((item) => item.id === 'partly');
}

function buildHourlyDailyAverages(hourly = {}) {
  const times = hourly.time || [];
  const humidities = hourly.relative_humidity_2m || [];
  const cloudCover = hourly.cloud_cover || [];
  const buckets = new Map();

  for (let index = 0; index < times.length; index += 1) {
    const dayKey = String(times[index]).slice(0, 10);
    if (!buckets.has(dayKey)) {
      buckets.set(dayKey, { humidityTotal: 0, humidityCount: 0, cloudTotal: 0, cloudCount: 0 });
    }
    const bucket = buckets.get(dayKey);
    const humidity = humidities[index];
    const cloud = cloudCover[index];
    if (typeof humidity === 'number') {
      bucket.humidityTotal += humidity;
      bucket.humidityCount += 1;
    }
    if (typeof cloud === 'number') {
      bucket.cloudTotal += cloud;
      bucket.cloudCount += 1;
    }
  }

  return buckets;
}

function applyTone(day, tone) {
  const { warmth, rain, wind, cloudBias } = toneAdjustments(tone);
  return {
    ...day,
    high: Math.round(day.high + warmth * 0.35),
    low: Math.round(day.low + warmth * 0.35),
    precip: clamp(Math.round(day.precip + rain * 0.45), 0, 100),
    windSpeed: clamp(Math.round(day.windSpeed + wind * 0.5), 0, 80),
    cloudiness: clamp(day.cloudiness + cloudBias * 0.4, 0, 1)
  };
}

function computeReadiness({ precip, windSpeed, high }) {
  return clamp(Math.round(86 - precip * 0.4 - windSpeed * 0.55 + (high >= 18 && high <= 27 ? 10 : 0)), 20, 97);
}

async function geocodeDestination(destination) {
  const geocodeUrl = new URL(OPEN_METEO_GEOCODE_URL);
  geocodeUrl.searchParams.set('name', destination);
  geocodeUrl.searchParams.set('count', '1');
  geocodeUrl.searchParams.set('language', 'en');
  geocodeUrl.searchParams.set('format', 'json');

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error(`Unable to geocode destination (${response.status}).`);
  }

  const data = await response.json();
  const location = data?.results?.[0];
  if (!location) {
    throw new Error('No matching destination found for live weather lookup.');
  }

  return location;
}

async function fetchProviderForecast({ destination, startDate, tone = 'balanced' }) {
  const location = await geocodeDestination(destination);
  const requestedStart = toDateOnly(startDate);
  const today = toDateOnly(dateIsoOnly(new Date()));
  const dayOffset = Math.floor((requestedStart - today) / 86400000);
  const startIndex = clamp(dayOffset, 0, 15);

  const forecastUrl = new URL(OPEN_METEO_FORECAST_URL);
  forecastUrl.searchParams.set('latitude', String(location.latitude));
  forecastUrl.searchParams.set('longitude', String(location.longitude));
  forecastUrl.searchParams.set('timezone', 'auto');
  forecastUrl.searchParams.set('forecast_days', '16');
  forecastUrl.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'uv_index_max'
    ].join(',')
  );
  forecastUrl.searchParams.set('hourly', ['relative_humidity_2m', 'cloud_cover'].join(','));

  const response = await fetch(forecastUrl);
  if (!response.ok) {
    throw new Error(`Unable to fetch live forecast (${response.status}).`);
  }

  const data = await response.json();
  const daily = data?.daily;
  if (!daily?.time?.length) {
    throw new Error('Weather provider returned no daily forecast data.');
  }

  const hourlyAverages = buildHourlyDailyAverages(data?.hourly);
  const totalDays = daily.time.length;
  const sliceEnd = Math.min(startIndex + 14, totalDays);
  const output = [];

  for (let index = startIndex; index < sliceEnd; index += 1) {
    const dateKey = daily.time[index];
    const date = new Date(`${dateKey}T09:00:00`);
    const humidityCloud = hourlyAverages.get(dateKey) || {};
    const humidity = humidityCloud.humidityCount
      ? Math.round(humidityCloud.humidityTotal / humidityCloud.humidityCount)
      : 55;
    const cloudiness = humidityCloud.cloudCount
      ? clamp(humidityCloud.cloudTotal / humidityCloud.cloudCount / 100, 0, 1)
      : 0.45;
    const weatherCode = daily.weather_code[index];
    const prelimSkyId = weatherCodeToSky(weatherCode, cloudiness);
    const prelim = {
      id: `${date.toISOString()}-${index}`,
      dateIso: date.toISOString(),
      label: dayLabel(date),
      shortDate: monthDay(date),
      dayNumber: date.getDate(),
      weekIndex: output.length < 7 ? 0 : 1,
      high: Math.round(daily.temperature_2m_max[index] ?? 21),
      low: Math.round(daily.temperature_2m_min[index] ?? 15),
      precip: clamp(Math.round(daily.precipitation_probability_max[index] ?? 15), 0, 100),
      windSpeed: clamp(Math.round(daily.wind_speed_10m_max[index] ?? 14), 0, 80),
      humidity: clamp(humidity, 20, 100),
      uv: clamp(Math.round(daily.uv_index_max[index] ?? 5), 0, 12),
      cloudiness,
      skyId: prelimSkyId,
      skyLabel: '',
      skySummary: '',
      readiness: 0,
      mood: moodNotes[Math.floor(Math.random() * moodNotes.length)]
    };

    const toned = applyTone(prelim, tone);
    const skyId = weatherCodeToSky(weatherCode, toned.cloudiness);
    const sky = findSkyById(skyId);
    output.push({
      ...toned,
      skyId,
      skyLabel: sky.label,
      skySummary: sky.summary,
      readiness: computeReadiness(toned)
    });
  }

  return output;
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

export async function getForecastResponse({ destination, startDate, tone, selectedActivities }) {
  let days;
  try {
    days = await fetchProviderForecast({ destination, startDate, tone });
  } catch (error) {
    // Fall back to deterministic data so the app still works if provider calls fail.
    days = generateForecast({ destination, startDate, tone });
  }
  const chosenActivities = selectedActivities?.length ? selectedActivities : defaultSelectedActivities;
  return buildRecommendations(days, chosenActivities);
}
