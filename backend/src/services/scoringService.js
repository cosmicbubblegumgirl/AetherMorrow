import { activities } from './constants.js';
import { clamp } from './helpers.js';

export function scoreActivity(activity, day) {
  let score = 100;
  const notes = [];
  const average = (day.high + day.low) / 2;

  if (average < activity.idealTemp[0]) {
    score -= (activity.idealTemp[0] - average) * 4.2;
    notes.push('Cooler than ideal.');
  }
  if (average > activity.idealTemp[1]) {
    score -= (average - activity.idealTemp[1]) * 4.2;
    notes.push('Warmer than ideal.');
  }
  if (day.precip > activity.maxPrecip) {
    score -= (day.precip - activity.maxPrecip) * (activity.kind === 'outdoor' ? 1.3 : 0.45);
    notes.push('Precipitation adds friction.');
  }
  if (day.windSpeed > activity.maxWind) {
    score -= (day.windSpeed - activity.maxWind) * (activity.kind === 'outdoor' ? 1.45 : 0.35);
    notes.push('Wind may complicate comfort.');
  }
  if (activity.favoriteSkies.includes(day.skyId)) {
    score += 8;
  }
  if (activity.id === 'stargazing') {
    score -= day.cloudiness * 42;
    if (day.cloudiness > 0.55) notes.push('Cloud cover hides the spectacle.');
  }
  if (activity.id === 'coastal-fishing' || activity.id === 'pier-rocks') {
    if (day.windSpeed <= activity.maxWind && day.precip <= activity.maxPrecip) {
      score += 10;
      notes.push('Sea-facing conditions look reasonably cooperative.');
    }
    if (day.skyId === 'storm') {
      score -= 18;
      notes.push('Storm energy makes fishing far less sensible.');
    }
  }
  if (activity.kind === 'indoor' && (day.skyId === 'rain' || day.skyId === 'storm')) {
    score += 9;
    notes.push('Indoor plans flourish in moody weather.');
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  let verdict = 'Not ideal';
  let badge = 'Keep it for another sky';
  if (finalScore >= 80) {
    verdict = 'Excellent';
    badge = 'A splendid idea';
  } else if (finalScore >= 60) {
    verdict = 'Maybe';
    badge = 'Good with a little planning';
  }
  return { score: finalScore, verdict, badge, notes: notes.length ? notes : ['The weather is broadly cooperative.'] };
}

export function buildRecommendations(days, selectedIds) {
  const selected = activities.filter((activity) => selectedIds.includes(activity.id));
  return days.map((day) => {
    const ranked = selected
      .map((activity) => ({ activity, advice: scoreActivity(activity, day) }))
      .sort((a, b) => b.advice.score - a.advice.score);

    return {
      ...day,
      topIdeas: ranked.slice(0, 3),
      indoorFallback: ranked.find((item) => item.activity.kind === 'indoor') || ranked[0] || null
    };
  });
}

export function scoreFishingSpot(spot, day) {
  const styleBonus = spot.style.toLowerCase().includes('pier') ? 2 : 0;
  const base = 92 - day.windSpeed * 1.7 - day.precip * 0.75 + (day.high >= 20 && day.high <= 27 ? 8 : 0) + styleBonus;
  return clamp(Math.round(base), 8, 98);
}
