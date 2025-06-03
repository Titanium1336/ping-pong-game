# Real-Time Ping Pong Game

A multiplayer ping pong game built with React, TypeScript, and Socket.IO featuring real-time gameplay between two players.

## Features

- Real-time multiplayer gameplay
- Responsive canvas-based game rendering
- Socket.IO for real-time communication
- TypeScript for type safety
- Modern React with Vite

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Socket.IO Client
- Tailwind CSS

**Backend:**
- Node.js
- Socket.IO
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ping-pong-game
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Running the Game

1. Start the backend server:
```bash
cd backend
npm run dev
```
The server will run on `http://localhost:3001`

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```
The game will be available at `http://localhost:8080`

### How to Play

1. Open the game in your browser at `http://localhost:8080`
2. Wait for another player to join (open another browser tab/window)
3. Use controls to move your paddle:
   - **Player 1**: Arrow keys (↑/↓)
   - **Player 2**: W/S keys
