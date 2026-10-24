import { TextField, Button } from "@mui/material";
import "./Lobby.css";

// Replace the props below with your existing state/handlers:
// localVideoRef -> your <video> ref, username/setUsername -> your input state, connect -> your connect function
export default function Lobby({ localVideoRef, username, setUsername, connect }) {
  const canJoin = username.trim().length > 0;

  return (
    <main className="lobby">
      <section className="lobby-card">
        <div className="lobby-preview">
          <video ref={localVideoRef} autoPlay muted playsInline />
        </div>

        <div className="lobby-form">
          <h1>Ready to join?</h1>
          <p className="lobby-sub">
            Meeting . Check your camera, then enter your name.
          </p>

          <TextField
            label="Your name"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canJoin && connect()}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!canJoin}
            onClick={connect}
          >
            Join meeting
          </Button>
        </div>
      </section>
    </main>
  );
}
