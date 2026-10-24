import {Routes, BrowserRouter as Router,Route } from 'react-router-dom';
import Landing from './pages/landing.jsx';
import Authentication from './pages/Authentication.jsx';
import { AuthProvider } from './contexts/AuthContexts.jsx';
import VideoMeetComponent from './pages/VideoMeetComponent.jsx';
import HomeComponent from './pages/home.jsx';
import History from './pages/History.jsx';
function App() {
  return (
<>
<Router>
<AuthProvider>
<Routes>
<Route path="/" element={<Landing />} />
<Route path="/auth" element={<Authentication />} />
<Route path="/home" element={<HomeComponent />} />
<Route path='/meet/:url' element={<VideoMeetComponent/>}/>
<Route path='/history' element={<History/>}/>
</Routes>
</AuthProvider>
</Router>


</>
)}

export default App
