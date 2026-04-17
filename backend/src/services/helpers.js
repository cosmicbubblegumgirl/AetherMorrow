import { climateProfiles, fishingSpotLibrary, worldDestinations } from './constants.js';

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalise(value = '') {
  return String(value).trim().toLowerCase();
}

export function findDestinationMeta(destination) {
  const query = normalise(destination);
  return worldDestinations.find((item) => normalise(item.city) === query) || null;
}

export function getClimateProfile(destination) {
  const meta = findDestinationMeta(destination);
  if (!meta) return climateProfiles.fallback;
  return climateProfiles[meta.climateKey] || climateProfiles.fallback;
}

export function getFishingSpots(destination) {
  const meta = findDestinationMeta(destination);
  if (!meta) return fishingSpotLibrary.global;
  if (fishingSpotLibrary[meta.city]) return fishingSpotLibrary[meta.city];
  if (meta.country === 'South Africa') return fishingSpotLibrary.defaultSouthAfrica;
  return fishingSpotLibrary.global;
}
