export default function FleetMap() {
  return (
    <section className="card" id="map">
      <div className="card-head"><h2>Fleet map</h2><span className="pill">Illustrative map</span></div>
      <div className="map">
        <svg viewBox="0 0 700 320" preserveAspectRatio="xMidYMid slice" aria-label="Illustrative map with four bike markers" role="img"><rect width="700" height="320" fill="#e5eee4"/><path d="M-30 45 L730 250 M-40 220 L700 35 M120 -20 L230 350 M390 -30 L490 350 M610 -30 L700 350" stroke="#fff" strokeWidth="23"/><path d="M-30 45 L730 250 M-40 220 L700 35 M120 -20 L230 350 M390 -30 L490 350 M610 -30 L700 350" stroke="#d1ddd0" strokeWidth="2"/><path d="M5 300 Q160 210 250 270 T700 230" fill="none" stroke="#bfd4c0" strokeWidth="18"/><g fill="#193f30" stroke="#fff" strokeWidth="5"><circle cx="280" cy="125" r="15"/><circle cx="325" cy="170" r="15"/><circle cx="440" cy="120" r="15"/><circle cx="210" cy="230" r="15"/></g><g fill="#d9fa8b" textAnchor="middle" fontSize="14" fontWeight="bold"><text x="280" y="130">1</text><text x="325" y="175">2</text><text x="440" y="125">3</text><text x="210" y="235">4</text></g></svg>
        <div className="map-label">Midpoint Hub</div>
      </div>
    </section>
  );
}
