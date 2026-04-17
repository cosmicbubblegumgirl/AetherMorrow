import { Router } from 'express';
import { getFishingSpots } from '../services/helpers.js';
import { scoreFishingSpot } from '../services/scoringService.js';

const router = Router();

router.get('/', (request, response) => {
  const destination = String(request.query.destination || 'Ramsgate');
  const precip = Number(request.query.precip || 18);
  const windSpeed = Number(request.query.windSpeed || 14);
  const high = Number(request.query.high || 24);

  const referenceDay = {
    precip,
    windSpeed,
    high
  };

  const spots = getFishingSpots(destination)
    .map((spot) => ({
      ...spot,
      suitability: scoreFishingSpot(spot, referenceDay)
    }))
    .sort((left, right) => right.suitability - left.suitability);

  response.json({ spots });
});

export default router;
