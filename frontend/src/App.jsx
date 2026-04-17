import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Backpack,
  CalendarDays,
  Compass,
  Fish,
  Globe2,
  LoaderCircle,
  MapPinned,
  MoonStar,
  Search,
  Sparkles,
  Umbrella,
  Wand2,
  Wind,
  Waves,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Trees,
  Bike,
  Tent,
  Palette,
  Coffee,
  BookOpen,
  Music2
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { fetchFishingSpots, fetchForecast, fetchMeta, fetchPlans, savePlan } from './api/client';
import StatusPill from './components/StatusPill';
import MetricCard from './components/MetricCard';
import DayCard from './components/DayCard';
import RecommendationPanel from './components/RecommendationPanel';

const iconMap = {
  Trees,
  Compass,
  Bike,
  Tent,
  Palette,
  Coffee,
  BookOpen,
  MoonStar,
  Music2,
  Fish,
  Waves,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning
};

const skyIconMap = {
  sunlit: Sun,
  partly: CloudSun,
  rain: CloudRain,
  storm: CloudLightning,
  moonlit: MoonStar
};

const initialMeta = {
  tones: [],
  activities: [],
  worldDestinations: [],
  featuredWorldStops: [],
  defaultSelectedActivities: [],
  climateProfiles: {}
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatTemp(value) {
  return `${Math.round(value)}°C`;
}

function scoreActivity(activity, day) {
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

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
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

function withIcons(items) {
  return items.map((item) => ({
    ...item,
    icon: iconMap[item.icon] || Compass
  }));
}

export default function App() {
  const [meta, setMeta] = useState(initialMeta);
  const [destination, setDestination] = useState('Ramsgate');
  const [startDate, setStartDate] = useState(todayIso());
  const [forecastTone, setForecastTone] = useState('balanced');
  const [travelers, setTravelers] = useState('2');
  const [tripNote, setTripNote] = useState('Coastal escape with a polished fishing morning, one market stroll, and a gallery fallback.');
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('coastal-fishing');
  const [savedPlans, setSavedPlans] = useState([]);
  const [fishingSpots, setFishingSpots] = useState([]);
  const [activeWeek, setActiveWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [metaResponse, plansResponse] = await Promise.all([fetchMeta(), fetchPlans()]);
        setMeta(metaResponse);
        const defaults = metaResponse.defaultSelectedActivities?.length ? metaResponse.defaultSelectedActivities : [];
        setSelectedActivityIds(defaults);
        setSelectedActivityId(defaults.includes('coastal-fishing') ? 'coastal-fishing' : defaults[0] || '');
        setSavedPlans(plansResponse.plans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setBootLoading(false);
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (bootLoading || !selectedActivityIds.length) return;
    let alive = true;
    async function loadForecast() {
      setLoading(true);
      setError('');
      try {
        const response = await fetchForecast({
          destination,
          startDate,
          tone: forecastTone,
          selectedActivities: selectedActivityIds
        });
        if (!alive) return;
        setForecast(response.forecast || []);
        setSelectedDayId((current) => current || response.forecast?.[0]?.id || '');
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadForecast();
    return () => {
      alive = false;
    };
  }, [bootLoading, destination, startDate, forecastTone, selectedActivityIds, refreshTick]);

  const activities = useMemo(() => withIcons(meta.activities || []), [meta.activities]);
  const tones = meta.tones || [];
  const selectedActivities = useMemo(
    () => activities.filter((activity) => selectedActivityIds.includes(activity.id)),
    [activities, selectedActivityIds]
  );
  const selectedDay = useMemo(
    () => forecast.find((day) => day.id === selectedDayId) || forecast[0] || null,
    [forecast, selectedDayId]
  );
  const selectedActivity = useMemo(
    () => selectedActivities.find((activity) => activity.id === selectedActivityId) || selectedActivities[0] || null,
    [selectedActivities, selectedActivityId]
  );
  const recommendation = useMemo(
    () => (selectedActivity && selectedDay ? scoreActivity(selectedActivity, selectedDay) : null),
    [selectedActivity, selectedDay]
  );
  const activeDays = useMemo(
    () => forecast.filter((day) => day.weekIndex === activeWeek),
    [forecast, activeWeek]
  );
  const destinationMeta = useMemo(() => {
    const q = destination.trim().toLowerCase();
    return (meta.worldDestinations || []).find((item) => item.city.toLowerCase() === q) || null;
  }, [destination, meta.worldDestinations]);
  const climateLabel = useMemo(() => {
    if (!destinationMeta) return 'Adaptable global weather';
    return meta.climateProfiles?.[destinationMeta.climateKey]?.label || 'Adaptable global weather';
  }, [destinationMeta, meta.climateProfiles]);
  const summaryStats = useMemo(() => {
    if (!forecast.length) return { readiness: 0, bestDay: null, rainyDays: 0 };
    const readiness = Math.round(forecast.reduce((sum, day) => sum + day.readiness, 0) / forecast.length);
    const bestDay = [...forecast].sort((left, right) => right.readiness - left.readiness)[0];
    const rainyDays = forecast.filter((day) => day.precip >= 40).length;
    return { readiness, bestDay, rainyDays };
  }, [forecast]);
  const fishingActivity = useMemo(() => activities.find((item) => item.id === 'coastal-fishing'), [activities]);
  const fishingWindow = useMemo(() => {
    if (!forecast.length || !fishingActivity) return null;
    return [...forecast].sort((a, b) => scoreActivity(fishingActivity, b).score - scoreActivity(fishingActivity, a).score)[0];
  }, [forecast, fishingActivity]);
  const packingList = useMemo(() => {
    if (!forecast.length) return [];
    const list = ['Field notebook', 'Phone charger', 'One excellent layer'];
    if (forecast.some((day) => day.precip >= 35)) list.push('Umbrella with character');
    if (forecast.some((day) => day.low <= 12)) list.push('Light scarf or knit');
    if (forecast.some((day) => day.uv >= 8)) list.push('Sunscreen');
    if (selectedActivityIds.includes('coastal-fishing')) list.push('Compact tackle kit or casting lure roll');
    if (forecast.some((day) => day.skyId === 'storm')) list.push('Indoor backup itinerary');
    return list;
  }, [forecast, selectedActivityIds]);

  useEffect(() => {
    if (!selectedDay) return;
    let alive = true;
    async function loadSpots() {
      try {
        const response = await fetchFishingSpots({
          destination,
          precip: selectedDay.precip,
          windSpeed: selectedDay.windSpeed,
          high: selectedDay.high
        });
        if (alive) setFishingSpots(response.spots || []);
      } catch {
        if (alive) setFishingSpots([]);
      }
    }
    loadSpots();
    return () => {
      alive = false;
    };
  }, [destination, selectedDay]);

  function toggleActivity(activityId) {
    setSelectedActivityIds((current) => {
      if (current.includes(activityId)) {
        const next = current.length === 1 ? current : current.filter((value) => value !== activityId);
        if (!next.includes(selectedActivityId)) {
          setSelectedActivityId(next[0] || '');
        }
        return next;
      }
      return [...current, activityId];
    });
  }

  async function saveCurrentPlan() {
    try {
      const response = await savePlan({
        id: Date.now().toString(),
        destination,
        startDate,
        forecastTone,
        travelers,
        tripNote,
        createdAt: new Date().toLocaleString(),
        bestDay: summaryStats.bestDay?.shortDate || null,
        readiness: summaryStats.readiness
      });
      setSavedPlans(response.plans || []);
    } catch (err) {
      setError(err.message);
    }
  }

  if (bootLoading) {
    return (
      <div className="boot-screen">
        <LoaderCircle className="spin" size={26} />
        <span>Summoning the weather atelier...</span>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <div className="constellation constellation-a" />
      <div className="constellation constellation-b" />

      <div className="page-wrap">
        <header className="topbar glass-panel">
          <div className="brand-cluster">
            <div className="brand-mark-wrap">
              <img src="/brand-mark.png" alt="Aethermorrow crest" className="brand-mark" />
            </div>
            <div>
              <p className="brand-script">Aethermorrow</p>
              <p className="tagline">Forecast the magic ahead.</p>
            </div>
          </div>
          <div className="chip-row">
            <StatusPill label="Weather intelligence" tone="gold" />
            <StatusPill label="Global atlas" tone="plum" />
            <StatusPill label="Fishing planner" tone="slate" />
          </div>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-script">
              Celestial planning, grounded decisions
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.06 }}>
              Aethermorrow
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} className="hero-body">
              A more creative, more dynamic forecasting studio for trips, coastal days, and weather-aware plans. Search the world, view a two-week calendar, compare activities, and see whether fishing, wandering, or café-hiding is the sensible move.
            </motion.p>

            <div className="metrics-grid">
              <MetricCard icon={Sparkles} title="Trip readiness" value={`${summaryStats.readiness}/100`} hint="A blended score for practicality and delight." />
              <MetricCard icon={CalendarDays} title="Best day" value={summaryStats.bestDay?.shortDate || '—'} hint={summaryStats.bestDay?.skyLabel || 'Conjure a forecast to begin.'} />
              <MetricCard icon={Fish} title="Fishing window" value={fishingWindow?.shortDate || '—'} hint={fishingWindow ? `${fishingWindow.windSpeed} km/h wind` : 'Waiting for the sea to speak.'} />
              <MetricCard icon={Globe2} title="Climate mood" value={destinationMeta?.city || destination} hint={climateLabel} />
            </div>
          </div>

          <section className="glass-panel planner-panel">
            <div className="row-between gap-lg wrap panel-head">
              <div>
                <p className="eyebrow">Trip planner</p>
                <h2>Plot the next fortnight</h2>
              </div>
              <div className="icon-shell large-icon-shell">
                <Wand2 size={26} />
              </div>
            </div>

            <div className="planner-grid">
              <label>
                <span>Destination</span>
                <div className="input-shell">
                  <Search size={16} />
                  <input list="world-destinations" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Search the world..." />
                </div>
                <datalist id="world-destinations">
                  {(meta.worldDestinations || []).map((item) => (
                    <option key={`${item.city}-${item.country}`} value={item.city}>{`${item.city}, ${item.country}`}</option>
                  ))}
                </datalist>
                <small>{destinationMeta ? `${destinationMeta.city}, ${destinationMeta.country} · ${destinationMeta.region}` : 'Custom destination · global fallback model'}</small>
              </label>

              <label>
                <span>Start date</span>
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </label>

              <label>
                <span>Forecast mood</span>
                <select value={forecastTone} onChange={(event) => setForecastTone(event.target.value)}>
                  {tones.map((tone) => (
                    <option key={tone.id} value={tone.id}>{`${tone.name} — ${tone.note}`}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Travellers</span>
                <input value={travelers} onChange={(event) => setTravelers(event.target.value)} placeholder="2" />
              </label>
            </div>

            <div className="featured-row">
              <p className="eyebrow">Featured world stops</p>
              <div className="chip-row compact-row">
                {(meta.featuredWorldStops || []).map((stop) => (
                  <button key={stop} className={`chip-button ${destination === stop ? 'chip-button-active' : ''}`} onClick={() => setDestination(stop)}>
                    {stop}
                  </button>
                ))}
              </div>
            </div>

            <label>
              <span>Planning note</span>
              <textarea value={tripNote} onChange={(event) => setTripNote(event.target.value)} rows={4} placeholder="What flavour of trip are you plotting?" />
            </label>

            <div>
              <div className="row-between gap-sm wrap section-minihead">
                <p className="eyebrow">Activity palette</p>
                <p className="muted small">Choose the ones you care about.</p>
              </div>
              <div className="chip-row compact-row">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  const active = selectedActivityIds.includes(activity.id);
                  return (
                    <button key={activity.id} className={`chip-button ${active ? 'chip-button-active' : ''}`} onClick={() => toggleActivity(activity.id)}>
                      <Icon size={15} />
                      {activity.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="row gap-sm wrap">
              <button className="cta-button" onClick={() => setRefreshTick((value) => value + 1)}>
                {loading ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />}
                Forecast live
              </button>
              <button className="ghost-button" onClick={saveCurrentPlan}>
                Save to vault
              </button>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
          </section>
        </section>

        <section className="content-grid">
          <div className="glass-panel panel-pad">
            <div className="row-between gap-lg wrap">
              <div>
                <p className="eyebrow">Weather outlook</p>
                <h2>This week and next</h2>
              </div>
              <div className="switcher">
                {[{ id: 0, label: 'This week' }, { id: 1, label: 'Next week' }].map((tab) => (
                  <button key={tab.id} className={activeWeek === tab.id ? 'switcher-active' : ''} onClick={() => setActiveWeek(tab.id)}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-shell">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeDays}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'rgba(225,232,244,0.8)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(13, 19, 36, 0.92)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '18px',
                      color: 'white'
                    }}
                    formatter={(value, name) => [formatTemp(Number(value)), name === 'high' ? 'High' : 'Low']}
                  />
                  <Line type="monotone" dataKey="high" stroke="rgba(255, 211, 110, 0.95)" strokeWidth={3} dot={{ r: 4, fill: 'rgba(255,211,110,1)' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="low" stroke="rgba(126, 197, 255, 0.95)" strokeWidth={2} dot={{ r: 3, fill: 'rgba(126,197,255,1)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="days-grid">
              {loading ? (
                <div className="loading-tile">
                  <LoaderCircle className="spin" size={18} /> Gathering atmospheric gossip...
                </div>
              ) : (
                activeDays.map((day) => {
                  const Icon = skyIconMap[day.skyId] || CloudSun;
                  return (
                    <DayCard
                      key={day.id}
                      day={day}
                      icon={Icon}
                      selectedActivities={selectedActivities}
                      scoreActivity={scoreActivity}
                      onPickDay={setSelectedDayId}
                      isActive={selectedDay?.id === day.id}
                      formatTemp={formatTemp}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="sidebar-stack">
            <RecommendationPanel advice={recommendation} activity={selectedActivity} day={selectedDay} formatTemp={formatTemp} />

            <section className="glass-panel panel-pad">
              <div className="row-between gap-lg wrap">
                <div>
                  <p className="eyebrow">Decision engine</p>
                  <h2>Test any plan</h2>
                </div>
                <div className="icon-shell">
                  <Compass size={22} />
                </div>
              </div>

              <div className="planner-grid slim-grid">
                <label>
                  <span>Activity</span>
                  <select value={selectedActivityId} onChange={(event) => setSelectedActivityId(event.target.value)}>
                    {selectedActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>{activity.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Day</span>
                  <select value={selectedDay?.id || ''} onChange={(event) => setSelectedDayId(event.target.value)}>
                    {forecast.map((day) => (
                      <option key={day.id} value={day.id}>{`${day.label} · ${day.shortDate}`}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="inner-block">
                <p className="eyebrow">Planner whisper</p>
                <p className="planner-whisper">{selectedDay?.mood || 'The sky has not spoken yet.'}</p>
                <p className="muted small">Indoor fallback: {selectedDay?.indoorFallback?.activity?.name || 'Gallery Visit'}</p>
              </div>
            </section>
          </div>
        </section>

        <section className="lower-grid">
          <section className="glass-panel panel-pad">
            <div className="row-between gap-lg wrap">
              <div>
                <p className="eyebrow">Packing & prep</p>
                <h2>What to bring</h2>
              </div>
              <div className="icon-shell">
                <Backpack size={22} />
              </div>
            </div>

            <div className="stack-list">
              {packingList.map((item) => (
                <div key={item} className="list-card">
                  <span>{item}</span>
                  <span className="muted small">Recommended</span>
                </div>
              ))}
            </div>

            <div className="inner-block">
              <p className="eyebrow">Professional note</p>
              <p className="muted">
                The planner blends forecast conditions, wind tolerance, precipitation thresholds, and activity-specific preferences to estimate whether a plan is actually sensible. Celsius is used throughout for a cleaner global experience.
              </p>
            </div>
          </section>

          <section className="glass-panel panel-pad">
            <div className="row-between gap-lg wrap">
              <div>
                <p className="eyebrow">Best fishing spots near you</p>
                <h2>Nearby water worth considering</h2>
              </div>
              <div className="icon-shell">
                <MapPinned size={22} />
              </div>
            </div>

            <div className="inner-block">
              <div className="row-between gap-sm wrap">
                <div>
                  <p className="planner-whisper">{destinationMeta?.city || destination}</p>
                  <p className="muted small">Focused on the selected destination and chosen forecast day.</p>
                </div>
                <StatusPill label={selectedDay ? `For ${selectedDay.shortDate}` : 'Awaiting day'} tone="gold" />
              </div>
            </div>

            <div className="spots-grid">
              {fishingSpots.map((spot) => (
                <div key={spot.name} className="spot-card">
                  <div className="row-between gap-sm">
                    <div>
                      <h4>{spot.name}</h4>
                      <p className="muted small">{spot.distance} · {spot.style}</p>
                    </div>
                    <StatusPill label={`${spot.suitability}/100`} tone={spot.suitability >= 78 ? 'green' : spot.suitability >= 60 ? 'gold' : 'rose'} />
                  </div>
                  <p className="muted">Best for {spot.bestFor}.</p>
                  <p className="muted small">Weather fit considers wind, rain, and a calm-water bias for practical sessions.</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="glass-panel panel-pad">
          <div className="row-between gap-lg wrap">
            <div>
              <p className="eyebrow">Saved plans</p>
              <h2>Vault of future mischief</h2>
            </div>
            <div className="icon-shell">
              <Wind size={22} />
            </div>
          </div>

          <div className="vault-grid">
            {savedPlans.length ? (
              savedPlans.map((plan) => (
                <div key={plan.id} className="vault-card">
                  <div className="row-between gap-sm wrap">
                    <div>
                      <p className="eyebrow">{plan.createdAt}</p>
                      <h3>{plan.destination}</h3>
                    </div>
                    <StatusPill label={plan.forecastTone} tone="gold" />
                  </div>
                  <p className="muted">{plan.tripNote}</p>
                  <div className="chip-row compact-row">
                    <span className="soft-chip">Starts {plan.startDate}</span>
                    <span className="soft-chip">Travellers {plan.travelers}</span>
                    <span className="soft-chip">Readiness {plan.readiness}</span>
                  </div>
                  <p className="muted small">Best day: {plan.bestDay || 'TBD'}</p>
                </div>
              ))
            ) : (
              <div className="empty-vault">Save a plan and it will appear here with its note, readiness score, and best day.</div>
            )}
          </div>
        </section>

        <footer className="footer">A quantum cupcake creation</footer>
      </div>
    </div>
  );
}
