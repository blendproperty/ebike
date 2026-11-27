'use client';

import { useEffect, useState } from 'react';

const batteryLevel = 78;

function formatDuration(seconds) {
  return [Math.floor(seconds / 60), seconds % 60]
    .map((part) => String(part).padStart(2, '0')).join(':');
}

export default function Rider() {
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [lastRide, setLastRide] = useState(null);
  const riding = startedAt !== null;

  useEffect(() => {
    if (startedAt === null) return;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  function startRide() {
    setElapsed(0);
    setStartedAt(Date.now());
  }

  function endRide() {
    setLastRide(Math.floor((Date.now() - startedAt) / 1000));
    setStartedAt(null);
  }

  return (
    <main className="rider-shell">
      <header className="rider-header">
        <span className="rider-brand"><img src="/rider/icon-192.png" width="40" height="40" alt="" /> eBike Rider</span>
        <span className="rider-preview">Demo</span>
      </header>
      <h1>My bike</h1>
      <p className="rider-intro">Try a ride with a sample e-bike. The demo uses simulated data and controls.</p>
      <section className="rider-bike" aria-labelledby="rider-bike-name">
        <div className="rider-bike-top">
          <div>
            <p className="rider-label">Demo bike</p>
            <h2 id="rider-bike-name">eBike 01</h2>
          </div>
          <span className="rider-bike-status" role="status">{riding ? 'Ride active' : 'Ready to ride'}</span>
        </div>
        <div className="rider-battery">
          <label htmlFor="rider-battery">Battery</label>
          <strong>{batteryLevel}%</strong>
          <meter id="rider-battery" min="0" max="100" value={batteryLevel} />
        </div>
      </section>
      <section className="rider-ride" aria-labelledby="rider-ride-title">
        <h2 id="rider-ride-title">{riding ? 'Current ride' : 'Your ride'}</h2>
        {riding ? (
          <>
            <p className="rider-time" role="timer" aria-label="Elapsed ride time">{formatDuration(elapsed)}</p>
            <button type="button" onClick={endRide}>End demo ride</button>
          </>
        ) : (
          <>
            {lastRide !== null ? (
              <p role="status">Demo ride complete · {formatDuration(lastRide)} elapsed</p>
            ) : (
              <p>Start a demo ride to try the ride timer.</p>
            )}
            <button type="button" onClick={startRide}>Start demo ride</button>
          </>
        )}
      </section>
      <details className="rider-install">
        <summary>Install on your phone</summary>
        <p><strong>iPhone</strong> In Safari, choose Share, Add to Home Screen, then Open as Web App when shown.</p>
        <p><strong>Android</strong> In Chrome, open the menu and choose Add to Home screen or Install app.</p>
      </details>
    </main>
  );
}
