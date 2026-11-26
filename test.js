const assert = require('assert');
const mqtt = require('mqtt');
(async()=>{
 const response=await fetch('http://127.0.0.1:3000/api/fleet'); assert.equal(response.status,200); const data=await response.json(); assert.equal(data.simulated,true);assert.equal(data.bikes.length,4);assert(data.messages>0);assert(data.connected);
 const client=mqtt.connect('mqtt://127.0.0.1:1883'); const timeout=setTimeout(()=>{console.error('MQTT roundtrip timed out');process.exit(1)},5000);
 client.on('connect',()=>client.subscribe('test/roundtrip',err=>{assert.ifError(err);client.publish('test/roundtrip','hello')}));
 client.on('message',(topic,payload)=>{assert.equal(topic,'test/roundtrip');assert.equal(payload.toString(),'hello');clearTimeout(timeout);client.end(true);console.log('PASS: HTTP fleet endpoint, simulator and MQTT publish/subscribe roundtrip');});
})().catch(err=>{console.error(err);process.exit(1)});
