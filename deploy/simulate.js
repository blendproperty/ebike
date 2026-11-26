'use strict';
const fs=require('fs'),mqtt=require('mqtt');const c=JSON.parse(fs.readFileSync(process.env.EBIKE_BROKER_CONFIG,'utf8'));
const client=mqtt.connect(process.env.EBIKE_MQTT_URL||'mqtt://127.0.0.1:3184',{username:c.username,password:c.password,reconnectPeriod:0});
const bikes=[{id:'DEMO-001',name:'Willow',battery:87,status:'Available',location:'Midpoint Hub',simulated:true},{id:'DEMO-002',name:'River',battery:63,status:'On ride',location:'New Road',simulated:true},{id:'DEMO-003',name:'Sky',battery:28,status:'Needs charging',location:'West entrance',simulated:true},{id:'DEMO-004',name:'Ash',battery:94,status:'Available',location:'Midpoint Hub',simulated:true}];
client.on('connect',()=>{let remaining=bikes.length;for(const b of bikes)client.publish(`test/ebike/${b.id}/telemetry`,JSON.stringify(b),{qos:1},e=>{if(e){console.error(e);process.exitCode=1}if(!--remaining)client.end()})});client.on('error',e=>{console.error(e.message);process.exit(1)});
