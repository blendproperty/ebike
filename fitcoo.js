'use strict';

const fixtureId = 'FITCOO-SIM-01';

function degrees(value, axis) {
  const match = /^([+-]?)(\d{4,5}(?:\.\d+)?)([NSEW])?$/.exec(value);
  if (!match) return null;
  const [, sign, digits, hemisphere] = match;
  if ((!sign && !hemisphere) || (sign && hemisphere)) return null;
  if (hemisphere && !(axis === 'latitude' ? 'NS' : 'EW').includes(hemisphere)) return null;
  if (digits.split('.')[0].length !== (axis === 'latitude' ? 4 : 5)) return null;

  const raw = Number(digits);
  const whole = Math.floor(raw / 100);
  const minutes = raw - whole * 100;
  const limit = axis === 'latitude' ? 90 : 180;
  if (minutes >= 60 || whole > limit || (whole === limit && minutes > 0)) return null;

  const direction = sign === '-' || hemisphere === 'S' || hemisphere === 'W' ? -1 : 1;
  return Number((direction * (whole + minutes / 60)).toFixed(6));
}

function parseReport(payload, previous = {}) {
  if (payload.length > 4096) return null;
  let report;
  try {
    report = JSON.parse(payload.toString('utf8'));
  } catch {
    return null;
  }
  if (report?.i !== fixtureId) return null;

  const bike = {
    battery: null,
    status: 'Awaiting heartbeat',
    location: 'Awaiting GPS',
    ...previous,
    id: fixtureId,
    name: 'Fitcoo protocol test',
    simulated: true,
    protocol: 'fitcoo',
  };

  if (report.a === 27 || report.a === 16) {
    // The parameter response in the PDF shows trailing spaces on some keys.
    const battery = report.b ?? report['b '];
    if (!Number.isInteger(battery) || battery < 0 || battery > 100 || ![0, 1].includes(report.c)) return null;
    bike.battery = battery;
    bike.power = report.c === 0 ? 'on' : 'off';
    bike.status = battery <= 30 ? 'Needs charging' : report.c === 0 ? 'Powered on' : 'Powered off';
  } else if (report.a === 19) {
    if (typeof report.g !== 'string' || report.g.length > 96 || !Number.isSafeInteger(report.t) || report.t <= 0) return null;
    if (bike.gps && report.t < bike.gps.reportedAt) return null;
    const [lat, lon, businessType, locationType, ...extra] = report.g.split(',').map(part => part.trim());
    if (!lat || !lon || !['0', '1'].includes(businessType) || (locationType !== undefined && !['0', '1'].includes(locationType)) || extra.length) return null;
    const latitude = degrees(lat, 'latitude');
    const longitude = degrees(lon, 'longitude');
    bike.gps = { raw: report.g, reportedAt: report.t, latitude, longitude, locationType: locationType ?? null };
    bike.location = latitude === null || longitude === null
      ? 'GPS received · coordinate format unconfirmed'
      : `${latitude}, ${longitude}`;
  } else {
    return null;
  }

  return bike;
}

module.exports = { fixtureId, parseReport };
