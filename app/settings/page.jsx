'use client';

import { useEffect, useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({ provider: '', apn: '' });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('Loading saved settings…');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Load failed');
        setSettings(await response.json());
        setLoaded(true);
        setMessage('');
      } catch {
        if (!controller.signal.aborted) setMessage('Could not load Settings. Refresh to try again.');
      }
    }
    load();
    return () => controller.abort();
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving…');
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Save failed');
      setSettings(await response.json());
      setMessage('Saved');
    } catch {
      setMessage('Could not save. Your changes are still here.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="settings-shell">
      <a href="/">Fleet overview</a>
      <h1>Settings</h1>
      <section className="card">
        <h2>SIM and mobile network</h2>
        <p className="subtitle">Record the provider and APN once selected. Device provisioning is pending.</p>
        <form onSubmit={save}>
          <fieldset disabled={!loaded || saving}>
            <label>SIM provider<input name="provider" maxLength={80} value={settings.provider} placeholder="Pending selection" onChange={event => setSettings({ ...settings, provider: event.target.value })} /></label>
            <label>APN<input name="apn" maxLength={100} pattern="[A-Za-z0-9.\-]*" value={settings.apn} placeholder="Pending selection" onChange={event => setSettings({ ...settings, apn: event.target.value })} /></label>
            <button className="settings-link" type="submit">Save settings</button>
          </fieldset>
          <p role="status">{message}</p>
        </form>
      </section>
      <section className="card"><h2>Bike integration</h2><p>Awaiting the supplier protocol and a test bike.</p></section>
    </main>
  );
}
