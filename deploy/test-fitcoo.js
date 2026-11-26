'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const mqtt = require('mqtt');
const { setTimeout: delay } = require('node:timers/promises');
const { fixtureId, parseReport } = require('../fitcoo');

const config = JSON.parse(fs.readFileSync(process.env.EBIKE_BROKER_CONFIG, 'utf8'));
const dashboard = process.env.EBIKE_TEST_DASHBOARD || 'http://127.0.0.1:3185';
const broker = process.env.EBIKE_MQTT_URL || 'mqtt://127.0.0.1:3184';
const heartbeat = { a: 27, i: fixtureId, b: 76, c: 0 };
const gps = { a: 19, i: fixtureId, g: '-2559.7000,+02807.6200,0,0', t: Math.floor(Date.now() / 1000) };
const packet = data => Buffer.from(JSON.stringify(data));
const unsigned = parseReport(packet({ ...gps, g: '3020.5887,12006.4229,1' }));
assert.equal(unsigned.gps.latitude, null);
assert.equal(unsigned.gps.longitude, null);
assert.equal(parseReport(packet({ a: 16, i: fixtureId, 'b ': 80, c: 1 })).battery, 80);
assert.equal(parseReport(packet({ ...heartbeat, b: 101 })), null);

async function read(path) {
  const result = await fetch(dashboard + path, { signal: AbortSignal.timeout(5000) });
  assert.ok(result.ok, result.status);
  return result.json();
}

async function verify() {
  const before = await read('/api/settings');
  const baseline = await read('/api/fleet');
  const publisher = mqtt.connect(broker, {
    ...config.fitcooFixture,
    protocolVersion: 4,
    reconnectPeriod: 0,
    connectTimeout: 5000,
  });
  try {
    await new Promise((resolve, reject) => {
      publisher.once('connect', resolve);
      publisher.on('error', reject);
    });
    await assert.rejects(publisher.subscribeAsync('bike'), error => error.packet?.granted?.[0] === 128);
    await publisher.publishAsync('bike', packet(heartbeat), { qos: 1 });
    await publisher.publishAsync('bike', packet({ ...heartbeat, b: 101 }), { qos: 1 });
    await publisher.publishAsync('bike', packet({ ...heartbeat, i: 'UNREGISTERED' }), { qos: 1 });
    await publisher.publishAsync('bike', packet(gps), { qos: 1 });
    let fleet;
    for (let i = 0; i < 20; i++) {
      fleet = await read('/api/fleet');
      if (fleet.messages >= baseline.messages + 2) break;
      await delay(100);
    }
    assert.equal(fleet.messages, baseline.messages + 2);
    assert.equal(fleet.connected, true);
    assert.equal(fleet.bikes.some(bike => bike.id === 'UNREGISTERED'), false);
    const bike = fleet.bikes.find(bike => bike.id === fixtureId);
    assert.equal(bike.battery, 76);
    assert.equal(bike.status, 'Powered on');
    assert.equal(bike.simulated, true);
    assert.equal(bike.protocol, 'fitcoo');
    assert.deepEqual([bike.gps.latitude, bike.gps.longitude], [-25.995, 28.127]);
    assert.deepEqual(await read('/api/settings'), before);
    console.log('PASS: heartbeat, GPS, ignored invalid and unregistered reports, simulator subscribe denied, settings preserved');
  } finally {
    publisher.end(true);
  }
}
verify().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
