'use strict';
const assert=require('assert');
const mqtt=require('mqtt');
const fs=require('fs');
const cfg=JSON.parse(fs.readFileSync(process.env.EBIKE_BROKER_CONFIG,'utf8'));
const address=process.env.EBIKE_TEST_URL || 'mqtt://127.0.0.1:1884';
function connect(options){return new Promise((resolve,reject)=>{const c=mqtt.connect(address,{...options,reconnectPeriod:0,connectTimeout:4000});c.once('connect',()=>resolve(c));c.once('error',e=>{c.end(true);reject(e)});});}
(async()=>{
 await assert.rejects(connect({username:cfg.username,password:'wrong'}));
 const c=await connect({username:cfg.username,password:cfg.password});
 await new Promise((resolve,reject)=>c.subscribe('test/ebike/check',{qos:1},(e)=>e?reject(e):resolve()));
 const received=new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('timeout')),4000);c.once('message',(topic,payload)=>{clearTimeout(t);resolve([topic,payload.toString()]);});});
 await new Promise((resolve,reject)=>c.publish('test/ebike/check','synthetic', {qos:1},e=>e?reject(e):resolve()));
 assert.deepStrictEqual(await received,['test/ebike/check','synthetic']);
 await new Promise((resolve,reject)=>c.subscribe('other/#',(e,grants)=>{try{assert(e && e.packet && e.packet.granted[0]===128);resolve()}catch(err){reject(err)}}));
 c.end(true);console.log('PASS: valid MQTT connection, message roundtrip, bad credentials rejected, unrelated topic subscription denied');
})().catch(e=>{console.error(e);process.exit(1)});
