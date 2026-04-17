export default function StatusPill({ label, tone = 'gold' }) {
  const classes = {
    gold: 'pill pill-gold',
    green: 'pill pill-green',
    plum: 'pill pill-plum',
    slate: 'pill pill-slate',
    rose: 'pill pill-rose'
  };

  return <span className={classes[tone] || classes.gold}>{label}</span>;
}
