import { motion } from 'framer-motion';
import StatusPill from './StatusPill';

export default function DayCard({ day, icon: Icon, selectedActivities, scoreActivity, onPickDay, isActive, formatTemp }) {
  const best = day?.topIdeas?.[0];

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={() => onPickDay(day.id)}
      className={`day-card glass-panel ${isActive ? 'day-card-active' : ''}`}
    >
      <div className="day-card-head">
        <div>
          <p className="eyebrow">{day.label}</p>
          <h3>{day.shortDate}</h3>
        </div>
        <div className="icon-shell">
          <Icon size={22} />
        </div>
      </div>

      <div className="day-temps">
        <span className="day-temp-primary">{formatTemp(day.high)}</span>
        <span className="muted">Low {formatTemp(day.low)}</span>
      </div>

      <p className="muted">{day.skySummary}</p>

      <div className="chip-row compact-row">
        <span className="soft-chip">Rain {day.precip}%</span>
        <span className="soft-chip">Wind {day.windSpeed} km/h</span>
        <span className="soft-chip">Readiness {day.readiness}</span>
      </div>

      <div className="day-idea-block">
        <div className="row-between gap-sm wrap">
          <p className="eyebrow">Top idea</p>
          <StatusPill
            tone={best?.advice?.score >= 80 ? 'green' : best?.advice?.score >= 60 ? 'gold' : 'rose'}
            label={best?.advice?.badge || 'Flexible day'}
          />
        </div>
        <h4>{best?.activity?.name || 'Open-ended magic'}</h4>
        <p className="muted small">{best?.activity?.description || 'Pick something lovely and adaptable.'}</p>
        <div className="chip-row compact-row">
          {selectedActivities.slice(0, 3).map((activity) => {
            const result = scoreActivity(activity, day);
            return (
              <span key={`${day.id}-${activity.id}`} className="soft-chip subtle">
                {activity.name} · {result.score}
              </span>
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}
