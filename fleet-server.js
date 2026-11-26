'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),mqtt=require('mqtt');
const config=JSON.parse(fs.readFileSync(process.env.EBIKE_BROKER_CONFIG,'utf8'));
const file=process.env.EBIKE_STATE_PATH;if(!file)throw Error('EBIKE_STATE_PATH required');
let state={bikes:{},settings:{apn:'',provider:''},messages:0,lastMessage:null};
if(fs.existsSync(file))state=JSON.parse(fs.readFileSync(file,'utf8'));
function save(){const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(state),{mode:0o600});fs.renameSync(tmp,file)}
const client=mqtt.connect(process.env.EBIKE_MQTT_URL||'mqtt://127.0.0.1:3184',{username:config.username,password:config.password,clientId:'ebike-dashboard-service'});
client.on('connect',()=>client.subscribe('test/ebike/+/telemetry',{qos:1}));
client.on('error',e=>console.error('MQTT connection:',e.message));
client.on('message',(topic,payload)=>{
 try {if(payload.length>4096)return;const id=topic.split('/')[2];const d=JSON.parse(payload.toString());
 if(!/^[A-Za-z0-9_-]{1,32}$/.test(id)||d.id!==id||typeof d.battery!=='number'||d.battery<0||d.battery>100||!['Available','On ride','Needs charging'].includes(d.status)||typeof d.name!=='string'||d.name.length>40||typeof d.location!=='string'||d.location.length>80||d.simulated!==true)return;
 state.bikes[id]={id,name:d.name,battery:d.battery,status:d.status,location:d.location,simulated:true,updatedAt:new Date().toISOString()};state.messages++;state.lastMessage=new Date().toISOString();save();
 }catch(e){console.error('Rejected telemetry:',e.message)}
});
const server=http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='GET'&&req.url==='/api/fleet'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({bikes:Object.values(state.bikes),settings:state.settings,messages:state.messages,lastMessage:state.lastMessage,connected:client.connected,simulated:true}));}
 if(req.method==='POST'&&req.url==='/api/settings'){
  if(req.headers.origin && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.origin)){res.writeHead(403);return res.end('Forbidden')}
  let body='';req.on('data',chunk=>{body+=chunk;if(body.length>2048)req.destroy()});req.on('end',()=>{try{const d=JSON.parse(body);if(typeof d.apn!=='string'||d.apn.length>100||!/^[-.a-zA-Z0-9]*$/.test(d.apn)||typeof d.provider!=='string'||d.provider.length>80)throw Error('Invalid settings');state.settings={apn:d.apn,provider:d.provider};save();res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(state.settings))}catch{res.writeHead(400);res.end('Invalid settings')}});return;
 }
 if(req.method==='GET'&&(req.url==='/'||req.url==='/index.html')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return fs.createReadStream(path.join(__dirname,'index.html')).pipe(res)}
 res.writeHead(404);res.end('Not found');
});
server.listen(Number(process.env.DASHBOARD_PORT||3185),'127.0.0.1',()=>console.log('Fleet dashboard listening on loopback'));
function stop(){client.end(true);server.close(()=>process.exit());setTimeout(()=>process.exit(),2000).unref()};process.on('SIGTERM',stop);process.on('SIGINT',stop);
