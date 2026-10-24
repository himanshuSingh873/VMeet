import React from "react";
import './Landing.css';
import { Link } from "react-router-dom";
export default function Landing() {
    return (
        <div className="landingPageContainer">
        <nav>
            <div className="navHeader">
                <h1>VMeet</h1>
            </div>
            <div className="navList">
             <p>Guest</p>
             <p>Register</p>
             <div  role="button" className="loginBtn">
                <p>Login</p>
             </div>
            </div>
        </nav>

        <div className="landingPageContent">
            <div className="landingPageContentLeft">
                <h4 style={{fontSize: '2.5rem'}}><spam style={{ fontWeight: 'bold',color: '#D97500' }}>Connect.</spam> Communicate. <spam style={{ fontWeight: 'bold',color: ' #4da3ff' }}>Collaborate.</spam></h4>
                <p style={{ fontSize: '1.5rem', lineHeight: '1.8' }}>Cover a Distance By VMeet</p>

                <div  role="button" className="getStartedBtn">
                    <Link to="/auth" style={{ textDecoration: 'none', color: 'white' }}>Get Started</Link>
                </div>
             </div>
            <div className="landingPageContentRight">
                <img src="/mobiles.png" alt="hero" />
            </div>
            </div>
        </div>
    );
}