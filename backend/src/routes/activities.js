import { Router } from 'express';
import {
  activities,
  climateProfiles,
  defaultSelectedActivities,
  featuredWorldStops,
  tones,
  worldDestinations
} from '../services/constants.js';

const router = Router();

router.get('/', (_request, response) => {
  response.json({
    activities,
    tones,
    worldDestinations,
    featuredWorldStops,
    defaultSelectedActivities,
    climateProfiles
  });
});

export default router;
