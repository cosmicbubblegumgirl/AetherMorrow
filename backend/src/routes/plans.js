import { Router } from 'express';
import { readPlans, savePlan } from '../services/storageService.js';

const router = Router();

router.get('/', async (_request, response, next) => {
  try {
    const plans = await readPlans();
    response.json({ plans });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const payload = request.body || {};
    const plan = {
      id: payload.id || Date.now().toString(),
      destination: payload.destination || 'Unknown destination',
      startDate: payload.startDate || new Date().toISOString().slice(0, 10),
      forecastTone: payload.forecastTone || 'balanced',
      travelers: payload.travelers || '1',
      tripNote: payload.tripNote || '',
      createdAt: payload.createdAt || new Date().toLocaleString(),
      bestDay: payload.bestDay || null,
      readiness: payload.readiness || 0
    };

    const plans = await savePlan(plan);
    response.status(201).json({ plans, saved: plan });
  } catch (error) {
    next(error);
  }
});

export default router;
