import cors from 'cors';
import express from 'express';
import activitiesRouter from './routes/activities.js';
import forecastRouter from './routes/forecast.js';
import fishingSpotsRouter from './routes/fishingSpots.js';
import plansRouter from './routes/plans.js';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'aethermorrow-backend' });
});

app.use('/api/activities', activitiesRouter);
app.use('/api/forecast', forecastRouter);
app.use('/api/fishing-spots', fishingSpotsRouter);
app.use('/api/plans', plansRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: 'The atmosphere became unstable.',
    detail: error?.message || 'Unknown server error'
  });
});

app.listen(port, () => {
  console.log(`Aethermorrow backend listening on http://localhost:${port}`);
});
