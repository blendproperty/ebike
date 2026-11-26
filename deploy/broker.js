'use strict';
const { Aedes } = require('aedes');
const net = require('net');
const fs = require('fs');
const crypto = require('crypto');
const config = JSON.parse(fs.readFileSync(process.env.EBIKE_BROKER_CONFIG, 'utf8'));
if (typeof config.username !== 'string' || !config.username || typeof config.password !== 'string' || config.password.length < 24) throw new Error('A username and strong password are required');
function equal(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length && crypto.timingSafeEqual(x,y)}
(async()=>{
 const broker=await Aedes.createBroker();
 broker.authenticate=(client,username,password,done)=>done(null,Boolean(username && password && equal(username,config.username) && equal(password,config.password)));
 broker.authorizePublish=(client,packet,done)=>done(packet.topic.startsWith('test/ebike/') ? null : new Error('Not authorized'));
 broker.authorizeSubscribe=(client,sub,done)=>done(null,sub.topic.startsWith('test/ebike/') ? sub : null);
 const server=net.createServer(broker.handle);
 server.listen(Number(process.env.EBIKE_BROKER_PORT || 1884),'127.0.0.1',()=>console.log('Authenticated test MQTT broker listening on loopback'));
 function shutdown(){server.close();broker.close(()=>process.exit());setTimeout(()=>process.exit(),2000).unref();}
 process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
})().catch(err=>{console.error(err.message);process.exit(1)});
