import React, { useEffect, useRef, useState} from "react"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import IconButton from "@mui/material/IconButton";
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import io from "socket.io-client"
import './VideoComponent.css';
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContexts.jsx";
import Lobby from "./Lobby.jsx";
var connections={};
const server_url="http://localhost:8080";
const peerConfigConnection = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};
export default function VideoMeetComponent(){
  var socketRef=useRef();
  let socketIdRef=useRef();
  let localVideoRef=useRef();
  let [videoAvailable,setVideoAvailable]=useState(true);
  let [audioAvailable,setAudioAvailable]=useState(true);
  let [video,setVideo]=useState()
  let [audio,setAudio]=useState()
  let [screen,setScreen]=useState()
  let [screenAvailable,setscreenAvailable]=useState();
  let [showModel,setShowModel]=useState(false)
  let [messages,setMessages]=useState([])
  let [message,setMessage]=useState("")
  let [newMessage,setNewMessage]=useState(0)
  let [askForUsername,setASkForUsername]=useState(true)
  let [username,setUSername]=useState("");
  const videoRef=useRef([])
  let [videos,setVideos]=useState([])
const {addToHistory}=React.useContext(AuthContext);
//  //TODO
//  if(isChrome()===false){

//  }
let RouteTo = useNavigate();
let connect = () => {
    setASkForUsername(false);
    getMedia()
};

const getPermission=async()=>{
    try{
       const videoPrmsn=await navigator.mediaDevices.getUserMedia({video:true});
    if(videoPrmsn){
        setVideoAvailable(true);
    }else{
        setVideoAvailable(false);
    }
    const audioPrmsn=await navigator.mediaDevices.getUserMedia({audio:true});
    if(audioPrmsn){
        setAudioAvailable(true);
    }else{
        setAudioAvailable(false);
    }

    if(navigator.mediaDevices.getDisplayMedia){
        setscreenAvailable(true);
    }else{
        setscreenAvailable(false);
    }
   if(videoAvailable || audioAvailable){
    const userMediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        if(userMediaStream){
            window.localStream=userMediaStream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject=userMediaStream;
            }
        }
   }
    }catch (err){
  console.log("permission problem",err);
    }
}

useEffect(()=>{
 getPermission();
},[])

let getUserMediaSuccess = (stream) => {
    try{
      window.localStream.getTracks().forEach(track=>track.stop())
    }catch(e){
        console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
    for(let id in connections){
        if(id===socketIdRef.current){continue}
        connections[id].addStream(window.localStream)

        connections[id].createOffer().then((decription)=>{
            connections[id].setLocalDescription(decription).then(()=>{
              socketRef.current.emit(
                       "signal",
                        id,
                       JSON.stringify({
                      "sdp": connections[id].localDescription
                    }))
            }).catch(e=>console.log(e))
        }).catch(e=>{console.log()})
    }
    stream.getTracks().forEach(track=>track.onended=()=>{
        setAudio(false)
        setVideo(false)

        try{
            let tracks=localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop());
        }catch(e){console.log(e)}
        //TODO blacksilence
         let blackSilence=(...args)=>new MediaStream([black(...args),silence(...args)])
        window.localStream=blackSilence()
        localVideoRef.current.srcObject=window.localStream;
        for(let id in connections){
            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description).then(()=>{
                    socketIdRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localStream}))
                }).catch(e=>console.log(e))
            })
        }
    })
};

let silence=()=>{
    let ctx= new AudioContext()
    let occilator=ctx.createOscillator()

    let dst=occilator.connect(ctx.createMediaStreamDestination())

    occilator.start()
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false})
}
let black=({width=680,height=480}={})=>{
    let canvas=Object.assign(document.createElement("canvas"),width,height);
    canvas.getContext('2d').fillRect(0,0,width,height);
    let stream=canvas.captureStream()
    return Object.assign(stream.getVideoTracks()[0],{enabled:false})
}

let getUserMedia=()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video,audio:audio})
        .then((stream)=>{
            getUserMediaSuccess(stream);
        })//todo getuserMediaSuccess
        .catch((e)=>{console.log(e)})
    }else{
        try{
        let tracks= localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        }
        catch(e){}
    }
}

useEffect(()=>{
    if(video !==undefined && audio !==undefined ){
        getUserMedia();
    }
},[video,audio])

let gotMessageFromServer = (fromId, message) => {

    var signal = JSON.parse(message);

    // Handle SDP
    if (signal.sdp) {

        console.log("📨 SDP RECEIVED:", signal.sdp.type);

        if (fromId !== socketIdRef.current) {

            connections[fromId]
                .setRemoteDescription(
                    new RTCSessionDescription(signal.sdp)
                )
                .then(() => {

                    if (signal.sdp.type === "offer") {

                        return connections[fromId].createAnswer();

                    }

                })
                .then((description) => {

                    if (!description) return;

                    return connections[fromId]
                        .setLocalDescription(description);

                })
                .then(() => {

                    if (connections[fromId].localDescription) {

                        socketRef.current.emit(
                            "signal",
                            fromId,
                            JSON.stringify({
                                sdp: connections[fromId].localDescription
                            })
                        );

                    }

                })
                .catch(e => {
                    console.log("SDP ERROR:", e);
                });
        }
    }

    // Handle ICE
    if (signal.ice) {

        console.log("🧊 ICE RECEIVED FROM:", fromId);

        connections[fromId]
            .addIceCandidate(
                new RTCIceCandidate(signal.ice)
            )
            .catch(e => {
                console.log("ICE ERROR:", e);
            });
    }
};
//this is from ChatGPT
const addMessage = (data, sender, socketIdSender) => {
    console.log("Received chat message:");
    console.log(data);
    console.log(sender);
    console.log(socketIdSender);
    setMessages((prevMessages) => [
        ...prevMessages,
        { data: data, sender: sender, socketIdSender: socketIdSender }
    ]);

    if(socketIdSender !== socketIdRef.current){
        setNewMessage((prevCount) => prevCount + 1);
        }
};

let connectToSocketServers=()=>{
   socketRef.current=io.connect(server_url,{source:false})

   socketRef.current.on('signal',gotMessageFromServer)

   socketRef.current.on("connect",()=>{
      socketRef.current.emit("join-call",window.location.href)
      socketIdRef.current=socketRef.current.id;

      socketRef.current.on("chat-message",addMessage);

      socketRef.current.on("user-left",(id)=>{
        setVideos((video)=>videos.filter((video)=>video.socketId !==id))
      })
    socketRef.current.on("user-joined",(id,clients)=>{
        //testing
        console.log("USER JOINED ID:", id);
        console.log("ALL CLIENTS:", clients);
        clients.forEach((socketListId)=>{
            connections[socketListId]= new RTCPeerConnection(peerConfigConnection);
            //testing
            console.log("PEER CONNECTION CREATED FOR:", socketListId);
            connections[socketListId].onicecandidate=(event)=>{
                //testing
                console.log("ICE CANDIDATE:", event.candidate);
                socketRef.current.emit("signal",socketListId,JSON.stringify({"ice":event.candidate}))
            }
           connections[socketListId].onaddstream = (event) => {
            console.log("🔥 REMOTE STREAM RECEIVED:", socketListId);
            console.log("REMOTE EVENT:", event);
            console.log("REMOTE STREAM:", event.stream);

                  const isVideoExist = videoRef.current?.find(
                       video => video.socketId === socketListId
                    );

                  if (isVideoExist) {

                 setVideos(prevVideos => {

                 const updatedVideos = prevVideos.map(video => {
                       return video.socketId === socketListId
                               ? {
                                ...video,
                                stream: event.stream
                               }
                              : video;
                        });

                    videoRef.current = updatedVideos;

                    return updatedVideos;
        });

    } else {

        const newVideo = {
            socketId: socketListId,
            stream: event.stream,
            autoplay: true,
            playsinline: true
        };

        setVideos(prevVideos => {

            const updatedVideos = [
                ...prevVideos,
                newVideo
            ];

            videoRef.current = updatedVideos;

            return updatedVideos;
        });
    }
};

           if(window.localStream !==undefined &&window.localStream !==null){
            connections[socketListId].addStream(window.localStream);
           }else{
            // TODO
             let blackSilence=(...args)=>new MediaStream([black(...args),silence(...args)])
            window.localStream=blackSilence()
            connections[socketListId].addStream(window.localStream);
           }

        })
        if(id===socketIdRef.current){
            for(let id2 in connections){
                if(id2  ===socketIdRef.current){
                    continue;
                }else{
                    try{
                      connections[id2].addStream(window.localStream);                    
                    }catch(e){
                        
                    }
                    connections[id2].createOffer().then((description)=>{
                        connections[id2].setLocalDescription(description)
                        .then(()=>{
                            socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                            
                        }).catch(e=>{console.log(e)})
                    })
                }
            }
        }

    })
   })
}

 let getMedia=()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServers();
 }

let getDisplayMediaSuccess = (stream) => {
    try{
      window.localStream.getTracks().forEach(track=>track.stop())
    }catch(e){
        console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
    for(let id in connections){
        if(id===socketIdRef.current){continue}
        connections[id].addStream(window.localStream);
        connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description).then(()=>{
                    socketRef.current.emit(
                        "signal",
                        id,
                        JSON.stringify({"sdp":connections[id].localDescription})
                    )
                }).catch(e=>console.log(e))
        }).catch(e=>{console.log(e)})
    }

   stream.getTracks().forEach(track=>track.onended=()=>{
        setScreen(false)

        try{
            let tracks=localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop());
        }catch(e){console.log(e)}
        //TODO blacksilence
         let blackSilence=(...args)=>new MediaStream([black(...args),silence(...args)])
        window.localStream=blackSilence()
        localVideoRef.current.srcObject=window.localStream;
      getUserMedia();
    })
}

let getDisplayMedia=()=>{
    if(screen){
        navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
        .then((stream)=>{
            getDisplayMediaSuccess(stream);
        }).catch((e)=>{console.log(e)})
}
}

useEffect(()=>{
    if(screen !==undefined){
        getDisplayMedia();
    }
},[screen])

let handleScrenShare=()=>{
        setScreen(!screen);
}

let sendMessage=()=>{
      console.log("MESSAGE BEFORE SEND:", message);
    console.log("USERNAME:", username);
    socketRef.current.emit("chat-message",message,username);
    setMessage("");
}
let handleEndCall= async()=>{
    try{
        let tracks=localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track=>track.stop());
    }catch(e){console.log(e)}

    RouteTo("/home");
}
    return(<>
       {
        askForUsername===true ?
        <div>
          <Lobby
        localVideoRef={localVideoRef}
      username={username}
      setUsername={setUSername}
      connect={connect}
    
    />
        </div>:
    
        <div className="meetVideoContent">
          
         {showModel? <div className="chatRoom" style={{color:'white'}}>
            <div className="chatContainer">
               <h2>Chat</h2>
               <div className="chatDisplay">
                {messages.length>0 ? messages.map((msg, index) => (
                    <div key={index} className="chatMessage">
                        <strong>{msg.sender}:</strong> {msg.data}
                    </div>
                )) : <p>No messages yet.</p>}   
               </div>
               <div className="chatingArea">
             <TextField value={message} 
                    onChange={(e)=>{
                        console.log("Typing", e.target.value);
                        setMessage(e.target.value)}}
                    id="outlined-basic"
                    label="Enter message" variant="outlined" />
             <Button variant="contained" onClick={sendMessage}>Send</Button>
               </div>
            </div>
            </div>
               :<></>}

        <div className="buttonConatainer">
          <IconButton style={{color:'white'}}>
            {video ? <VideocamIcon onClick={()=>setVideo(false)}/> : <VideocamOffIcon onClick={()=>setVideo(true)}/>}
          </IconButton>
          <IconButton style={{color:'white'}}>
            {audio ? <MicIcon onClick={()=>setAudio(false)}/> : <MicOffIcon onClick={()=>setAudio(true)}/>}
          </IconButton>
            {screenAvailable && <IconButton style={{color:'white'}} onClick={handleScrenShare}>
                {screen==true? <ScreenShareIcon/> : <StopScreenShareIcon/>}
                </IconButton>}

            <Badge badgeContent={newMessage} max={99} color="error">
                <IconButton style={{color:'white'}} onClick={()=>{setShowModel(!showModel); setNewMessage(0); }}>
                  <ChatIcon/>
                </IconButton>
            </Badge>

          <IconButton style={{color:'red'}} onClick={handleEndCall}>
            <CallEndRoundedIcon />
          </IconButton>
        </div>

        <video  className="meetUserVideo" ref={localVideoRef} muted autoPlay></video>
        <div className="conferenceView">
        {videos.map((video) => (
    <div  key={video.socketId}>
        <video
            autoPlay
            playsInline
            ref={(ref) => {
                if (ref && video.stream) {
                    ref.srcObject = video.stream;
                }
            }}
        />
    </div>
))}
</div>
        </div>
    }

    </>)
}