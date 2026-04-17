import { Router } from 'express';
import { getForecastResponse } from '../services/forecastService.js';

const router = Router();

router.get('/', async (request, response, next) => {
  const destination = request.query.destination || 'Ramsgate';
  const startDate = request.query.startDate || new Date().toISOString().slice(0, 10);
  const tone = request.query.tone || 'balanced';
  const selectedActivities = String(request.query.selectedActivities || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  try {
    const forecast = await getForecastResponse({ destination, startDate, tone, selectedActivities });
    response.json({ forecast });
  } catch (error) {
    next(error);
  }
});

export default router;
