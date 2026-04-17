import { Router } from 'express';
import { getForecastResponse } from '../services/forecastService.js';

const router = Router();

router.get('/', (request, response) => {
  const destination = request.query.destination || 'Ramsgate';
  const startDate = request.query.startDate || new Date().toISOString().slice(0, 10);
  const tone = request.query.tone || 'balanced';
  const selectedActivities = String(request.query.selectedActivities || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const forecast = getForecastResponse({ destination, startDate, tone, selectedActivities });
  response.json({ forecast });
});

export default router;
