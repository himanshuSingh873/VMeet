# 🎥 VMeet — Real-Time Video Conferencing Application

VMeet is a web-based video conferencing application designed to enable users to connect and communicate through online meetings. The project combines modern web technologies to provide a platform for video communication, user authentication, and meeting management.

## ✨ Features

- 🎥 **Video Conferencing:** Real-time video communication using WebRTC.
- 🔊 **Audio Communication:** Support for audio communication during video meetings.
- 🔐 **User Authentication:** Authentication functionality for users.
- 🏠 **Meeting Lobby:** A lobby interface for entering meeting details before joining.
- 🆔 **Meeting Rooms:** Meeting functionality supported by real-time communication.
- 📜 **Meeting History:** A page for accessing meeting history.
- ⚡ **Real-Time Communication:** Socket.IO for real-time client-server communication.
- 🎨 **Modern UI:** React-based interface with Material UI components.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Material UI (MUI)
- Vite

### Backend
- Node.js
- Express.js
- Socket.IO

### Real-Time Communication
- WebRTC
- Socket.IO

### Database and Data Models
- MongoDB, if configured in the current project

### Development Tools
- Git
- GitHub
- npm
- VS Code

## 📁 Project Structure

```text
VMeet/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/himanshuSingh873/VMeet.git
```

### 2. Navigate to the Project

```bash
cd VMeet
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the appropriate directory and configure the environment variables required by the application.

Depending on the current implementation, these may include:

- Server port
- Database connection string
- Authentication secret
- Frontend origin

Use the variable names expected by the existing source code. Never publish actual credentials or API secrets.

### 5. Start the Backend

From the `server` directory, run the start command configured in its `package.json`, for example:

```bash
npm start
```

### 6. Install Frontend Dependencies

Open another terminal:

```bash
cd VMeet/client
npm install
```

### 7. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

**Note:** The exact startup commands and required environment variables depend on the scripts and configuration in the current project.

## 🔒 Security

- Keep environment variables and credentials private.
- Never commit `.env` files.
- Do not expose database passwords or authentication secrets.
- Configure appropriate CORS policies before deploying the application.

## 🚀 Future Enhancements

Potential improvements include:

- Screen sharing
- Meeting participant management
- Microphone and camera controls
- Meeting invitation links
- Improved mobile responsiveness
- Deployment with production-ready configuration

## 👨‍💻 Author

**Himanshu Singh**

B.Tech — Information Technology

GitHub: [himanshuSingh873](https://github.com/himanshuSingh873)

---

⭐ If you find this project interesting, consider giving the repository a star!
