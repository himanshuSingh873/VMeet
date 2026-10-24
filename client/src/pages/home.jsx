import React from 'react';
import WithAuth from '../untils/WithAuth.jsx';
import { useNavigate } from 'react-router-dom';
import IconBotton from '@mui/material/IconButton';
import './home.css';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import logo from '../assets/logo3.png';
import { AuthContext } from '../contexts/AuthContexts.jsx';
function HomeComponent() {

   let navigate =useNavigate();
   const { addToHistory}=React.useContext(AuthContext);
   const[meetingId,setMeetingId]=React.useState("");
   const handleJoinMeeting = async () => {
        try{
            const result=await addToHistory(meetingId);
            console.log("Meeting added to history:", result);
        }catch(err){
            console.error("Error adding meeting to history:", err);
        }
         
        navigate(`/meet/${meetingId}`);
    }
 

    return (
        <>
        <div className="navBar">
            <div style={{display:'flex' ,alignItems:'center'}}>
                <h2>VMeet</h2>
            </div>
            <div style={{display:'flex'}}>
               <IconBotton onClick={()=>{
                navigate("/history");
               }}>
                <RestoreIcon/>
                <p>History</p>
               </IconBotton>
              <Button 
              onClick={()=>{
               localStorage.removeItem("token");
               navigate("/auth");
              }}>
                Logout
              </Button>
            </div>

        </div>

         <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Meeting</h2>

                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingId(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinMeeting} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img src={logo} alt="logo" />
                </div>
            </div>
        </>
    );
}

export default WithAuth(HomeComponent);