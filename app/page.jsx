'use client';

import { useEffect, useState } from 'react';
import FleetMap from './fleet-map';

const metrics = [
  ['Total bikes', 'In this test fleet'],
  ['Available', 'Ready for a ride'],
  ['On ride', 'Currently in use'],
  ['Needs charging', 'Battery requires attention'],
];

export default function Dashboard() {
  const [fleet, setFleet] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch('/api/fleet', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Fleet request failed');
        setFleet(await response.json());
        setOffline(false);
      } catch {
        if (!controller.signal.aborted) setOffline(true);
      }
    }
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  const bikes = fleet?.bikes ?? [];
  const disconnected = offline || fleet?.connected === false;
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">eBIKE FLEET</div>
        <nav className="side-caption" aria-label="Fleet">
          <a className="nav active" href="/">Overview</a>
          <a className="nav" href="#bikes">Bikes</a>
          <a className="nav" href="#map">Map</a>
          <a className="nav" href="/settings">Settings</a>
        </nav>
      </aside>
      <main>
        <header className="top">
          <div><h1>Fleet dashboard</h1><p className="subtitle">Bike status and recent telemetry</p></div>
          <div className="actions">
            <span className={disconnected ? 'pill disconnected' : 'pill'} role="status">
              {disconnected ? 'Test broker disconnected' : fleet ? 'Test broker connected' : 'Connecting…'}
            </span>
            <a className="settings-link" href="/settings">Settings</a>
          </div>
        </header>
        <div className="demo"><strong>Test environment</strong> · Simulated bikes and locations. Supplier integration is pending.</div>
        <section className="stats" aria-label="Fleet totals">
          {metrics.map(([label, description], index) => (
            <div className="card" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-num">{fleet ? (index === 0 ? bikes.length : bikes.filter(bike => bike.status === label).length) : '—'}</div>
              <div className="stat-sub">{description}</div>
            </div>
          ))}
        </section>
        <div className="grid">
          <FleetMap />
          <section className="card">
            <div className="card-head"><h2>Bike activity</h2></div>
            {bikes.map(bike => (
              <div className="bike" key={bike.id}>
                <div className="icon" aria-hidden="true">🚲</div>
                <div className="bike-info"><div className="bike-name">{bike.name} · {bike.id}</div><small>{bike.location}</small></div>
                <div><div className="status">{bike.status}</div><div className="battery">{bike.battery}%</div></div>
              </div>
            ))}
          </section>
        </div>
        <section className="card table-card" id="bikes">
          <div className="card-head"><h2>All bikes</h2><span className="muted">{fleet ? fleet.messages + ' simulated MQTT messages' : 'Waiting for telemetry'}</span></div>
          <div className="table-wrap">
            <table><thead><tr><th>Bike</th><th>Status</th><th>Battery</th><th>Last location</th><th>Source</th></tr></thead>
              <tbody>{bikes.map(bike => (
                <tr key={bike.id}><td><strong>{bike.id}</strong> · {bike.name}</td><td>{bike.status}</td><td>{bike.battery}%</td><td>{bike.location}</td><td>Simulated</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
