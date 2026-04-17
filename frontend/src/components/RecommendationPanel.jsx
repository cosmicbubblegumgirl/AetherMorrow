import { AlertTriangle, CheckCircle2, CircleDashed } from 'lucide-react';
import StatusPill from './StatusPill';

export default function RecommendationPanel({ advice, activity, day, formatTemp }) {
  if (!advice || !activity || !day) return null;

  const tone = advice.score >= 80 ? 'green' : advice.score >= 60 ? 'gold' : 'rose';
  const Icon = activity.icon;

  return (
    <section className="glass-panel panel-pad recommendation-panel">
      <div className="row-between gap-lg wrap">
        <div>
          <StatusPill label="Should we do this?" tone="plum" />
          <h2>{advice.badge}</h2>
          <p className="muted">
            {activity.name} on {day.shortDate} scores <strong>{advice.score}/100</strong>.
          </p>
        </div>
        <div className="icon-shell large-icon-shell">
          <Icon size={28} />
        </div>
      </div>

      <div className="recommendation-grid">
        <div className="inner-block">
          <p className="eyebrow">Why this rating</p>
          <ul className="bullet-list">
            {advice.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="muted small">{activity.tip}</p>
        </div>
        <div className="inner-block">
          <div className="row gap-sm verdict-row">
            {advice.score >= 80 ? (
              <CheckCircle2 size={18} />
            ) : advice.score >= 60 ? (
              <CircleDashed size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <strong>{advice.verdict}</strong>
          </div>
          <p className="muted small">
            Conditions: {day.skyLabel}, rain {day.precip}%, wind {day.windSpeed} km/h, high {formatTemp(day.high)}.
          </p>
          <div className="meter">
            <div className={`meter-fill ${tone}`} style={{ width: `${advice.score}%` }} />
          </div>
          <p className="muted small">Professional answer, whimsical delivery.</p>
        </div>
      </div>
    </section>
  );
}
