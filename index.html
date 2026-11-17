
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Random Video Chat</title>
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
<style>
*{box-sizing:border-box}
body{
 margin:0;padding:20px;background:#101322;color:white;
 font-family:Arial;text-align:center
}
h1{color:#60a5fa}
.wrap{max-width:850px;margin:auto}
.card{
 background:#202940;padding:18px;margin:18px auto;
 border-radius:18px
}
.videos{
 display:grid;grid-template-columns:1fr 1fr;gap:12px
}
video{
 width:100%;height:230px;object-fit:cover;
 background:#080b13;border-radius:12px
}
button{
 border:0;border-radius:10px;padding:13px 19px;
 margin:5px;background:#2563eb;color:white;
 font-size:15px;cursor:pointer
}
button.stop{background:#dc3545}
#status{color:#86efac;font-weight:bold}
@media(max-width:550px){
 .videos{grid-template-columns:1fr}
 video{height:220px}
}
</style>
</head>
<body>
<div class="wrap">
<h1>Random Video Chat</h1>
<p>Meet people around the world</p>

<div class="card">
<h3>Live Video Chat</h3>
<div class="videos">
<div>
<p>You</p>
<video id="localVideo" autoplay muted playsinline></video>
</div>
<div>
<p>Stranger</p>
<video id="remoteVideo" autoplay playsinline></video>
</div>
</div>

<p id="status">Ready to connect</p>

<button onclick="startCamera()">Start Camera</button>
<button class="stop" onclick="stopCamera()">Stop Camera</button>
<br>
<button onclick="startChat()">Start Chat</button>
<button onclick="nextChat()">Next / Skip</button>
</div>

<p>Random matching | Worldwide</p>
<p>18+ only. Respect other users and their privacy.</p>
</div>

<script>
const SERVER_URL =
"https://random-video-chat-f6ml.onrender.com";

let socket = null;
let localStream = null;
let peer = null;
let pendingCandidates = [];
let stopping = false;

const statusText = document.getElementById("status");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

function status(message){
 statusText.textContent = message;
}

async function startCamera(){
 try{
  if(localStream) return;
  localStream = await navigator.mediaDevices.getUserMedia({
   video:true,
   audio:true
  });
  localVideo.srcObject = localStream;
  status("Camera ready");
 }catch(error){
  alert("Camera permission required: " + error.message);
 }
}

function closePeer(){
 if(peer){
  peer.close();
  peer=null;
 }
 pendingCandidates=[];
 remoteVideo.srcObject=null;
}

function makePeer(){
 closePeer();

 peer = new RTCPeerConnection({
  iceServers:[
   {urls:"stun:stun.l.google.com:19302"}
  ]
 });

 localStream.getTracks().forEach(track=>{
  peer.addTrack(track,localStream);
 });

 peer.ontrack = event=>{
  remoteVideo.srcObject=event.streams[0];
 };

 peer.onicecandidate = event=>{
  if(event.candidate && socket){
   socket.emit("signal",{
    type:"candidate",
    candidate:event.candidate
   });
  }
 };

 peer.onconnectionstatechange=()=>{
  if(!peer) return;
  if(peer.connectionState==="connected"){
   status("Connected! Enjoy your chat.");
  }
  if(peer.connectionState==="failed"){
   status("Connection failed. Try Next.");
  }
 };

 return peer;
}

async function flushCandidates(){
 const items=pendingCandidates.splice(0);
 for(const candidate of items){
  try{
   await peer.addIceCandidate(candidate);
  }catch(error){
   console.log(error);
  }
 }
}

function setupSocket(){
 socket=io(SERVER_URL);

 socket.on("connect",()=>{
  status("Searching for someone...");
  socket.emit("find-partner");
 });

 socket.on("waiting",()=>{
  status("Waiting for a stranger...");
 });

 socket.on("matched",async data=>{
  status("Stranger found! Connecting...");
  const p=makePeer();

  if(data.initiator){
   const offer=await p.createOffer();
   await p.setLocalDescription(offer);
   socket.emit("signal",{
    type:"offer",
    sdp:p.localDescription
   });
  }
 });

 socket.on("signal",async data=>{
  try{
   if(data.type==="offer"){
    if(!localStream) await startCamera();
    if(!localStream) return;

    const p=makePeer();
    await p.setRemoteDescription(data.sdp);
    await flushCandidates();

    const answer=await p.createAnswer();
    await p.setLocalDescription(answer);

    socket.emit("signal",{
     type:"answer",
     sdp:p.localDescription
    });
   }

   else if(data.type==="answer" && peer){
    await peer.setRemoteDescription(data.sdp);
    await flushCandidates();
   }

   else if(data.type==="candidate"){
    if(peer && peer.remoteDescription){
     await peer.addIceCandidate(data.candidate);
    }else{
     pendingCandidates.push(data.candidate);
    }
   }
  }catch(error){
   console.error(error);
   status("Connection error. Try Next.");
  }
 });

 socket.on("skipped",()=>{
  closePeer();

  if(stopping){
   stopping=false;
   status("Camera stopped");
   return;
  }

  status("Finding another person...");
  socket.emit("find-partner");
 });

 socket.on("partner-left",()=>{
  closePeer();
  status("Stranger disconnected. Press Start Chat.");
 });

 socket.on("disconnect",()=>{
  closePeer();
  status("Server disconnected. Reconnect.");
 });
}

async function startChat(){
 if(!localStream) await startCamera();
 if(!localStream) return;

 if(!socket){
  status("Connecting to server...");
  setupSocket();
 }else if(socket.connected){
  status("Searching...");
  socket.emit("find-partner");
 }else{
  status("Reconnecting...");
  socket.once("connect",()=>{
   socket.emit("find-partner");
  });
 }
}

function nextChat(){
 if(socket && socket.connected){
  closePeer();
  status("Skipping...");
  socket.emit("skip");
 }else{
  startChat();
 }
}

function stopCamera(){
 stopping=true;

 if(socket && socket.connected){
  socket.emit("skip");
 }else{
  stopping=false;
 }

 closePeer();

 if(localStream){
  localStream.getTracks().forEach(track=>track.stop());
  localStream=null;
 }

 localVideo.srcObject=null;
 status("Camera stopped");
}
</script>
</body>
</html>
