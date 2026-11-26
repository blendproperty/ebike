const { Aedes } = require('aedes');
async function main(){
const aedes = await Aedes.createBroker();
const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');
const bikes = [
 {id:'EB-001',name:'Willow',battery:87,status:'Available',location:'Midpoint Hub',lat:-25.995,lon:28.127},
 {id:'EB-002',name:'River',battery:63,status:'On ride',location:'New Road',lat:-25.996,lon:28.131},
 {id:'EB-003',name:'Sky',battery:28,status:'Needs charging',location:'West entrance',lat:-25.998,lon:28.124},
 {id:'EB-004',name:'Ash',battery:94,status:'Available',location:'Midpoint Hub',lat:-25.994,lon:28.125}
];
const broker = net.createServer(aedes.handle);
broker.listen(1883,'127.0.0.1',()=>console.log('MQTT test broker: 127.0.0.1:1883'));
const client = mqtt.connect('mqtt://127.0.0.1:1883',{clientId:'dashboard-simulator'});
let messages = 0, lastMessage = null;
client.on('connect',()=>{
 client.subscribe('demo/bikes/+/telemetry',()=>{
  function send(){ for(const b of bikes) client.publish(`demo/bikes/${b.id}/telemetry`,JSON.stringify({...b,simulated:true})); }
  send(); setInterval(send,15000);
 });
});
client.on('message',(topic,payload)=>{try {const data=JSON.parse(payload.toString()); if(data.simulated === true && bikes.some(b=>b.id===data.id)){ messages++; lastMessage=new Date().toISOString(); }} catch {}});
const server=http.createServer((req,res)=>{
 if(req.url==='/api/fleet'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({bikes,messages,lastMessage,connected:client.connected,simulated:true}));}
 if(req.url==='/' || req.url==='/index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return fs.createReadStream(path.join(__dirname,'index.html')).pipe(res);}
 res.writeHead(404);res.end('Not found');
});
server.listen(3000,process.env.DASHBOARD_HOST || '127.0.0.1',()=>console.log('Dashboard: http://127.0.0.1:3000'));
function shutdown(){client.end(true);server.close();broker.close();aedes.close(()=>process.exit());setTimeout(()=>process.exit(),2000).unref();}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);

}
main().catch(err=>{console.error(err); process.exit(1)});
