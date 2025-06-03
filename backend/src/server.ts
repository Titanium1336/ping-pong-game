import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { GameState, Player, GameRoom, KeyState } from './types/game';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;

// Game state
let gameRoom: GameRoom = {
    id: 'main-room',
    players: [],
    gameStarted: false,
    gameState: {
        ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED },
        paddles: {
            player1: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
            player2: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 }
        },
        score: { player1: 0, player2: 0 },
        gameWidth: GAME_WIDTH,
        gameHeight: GAME_HEIGHT
    }
};

// Track player key states
const playerKeyStates: { [playerId: string]: KeyState } = {};

// Game loop
const gameLoop = () => {
    if (!gameRoom.gameStarted || gameRoom.players.length < 2) return;

    const { ball, paddles } = gameRoom.gameState;

    // Update paddle positions based on key states
    gameRoom.players.forEach(player => {
        const keyState = playerKeyStates[player.id];
        if (!keyState) return;

        const paddle = player.playerNumber === 1 ? paddles.player1 : paddles.player2;

        if (keyState.up) {
            paddle.y = Math.max(0, paddle.y - PADDLE_SPEED);
        }
        if (keyState.down) {
            paddle.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, paddle.y + PADDLE_SPEED);
        }
    });

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0 || ball.y >= GAME_HEIGHT) {
        ball.dy = -ball.dy;
        ball.y = Math.max(0, Math.min(GAME_HEIGHT, ball.y));
    }

    // Ball collision with paddles
    const ballRadius = 8;
    const paddleWidth = 10;

    // Left paddle collision (Player 1)
    if (ball.x - ballRadius <= 30 &&
        ball.y >= paddles.player1.y &&
        ball.y <= paddles.player1.y + PADDLE_HEIGHT &&
        ball.dx < 0) {
        ball.dx = -ball.dx;
        ball.x = 30 + ballRadius;
    }

    // Right paddle collision (Player 2)
    if (ball.x + ballRadius >= GAME_WIDTH - 30 &&
        ball.y >= paddles.player2.y &&
        ball.y <= paddles.player2.y + PADDLE_HEIGHT &&
        ball.dx > 0) {
        ball.dx = -ball.dx;
        ball.x = GAME_WIDTH - 30 - ballRadius;
    }

    // Scoring
    if (ball.x < 0) {
        gameRoom.gameState.score.player2++;
        resetBall();
    } else if (ball.x > GAME_WIDTH) {
        gameRoom.gameState.score.player1++;
        resetBall();
    }

    // Emit game state to all players
    io.to('main-room').emit('gameStateUpdate', gameRoom.gameState);
};

const resetBall = () => {
    gameRoom.gameState.ball = {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
        dy: (Math.random() - 0.5) * BALL_SPEED
    };
};

// Start game loop
setInterval(gameLoop, 1000 / 60); // 60 FPS

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Initialize player key state
    playerKeyStates[socket.id] = { up: false, down: false };

    // Add player to room
    if (gameRoom.players.length < 2) {
        const playerNumber = gameRoom.players.length === 0 ? 1 : 2;
        const newPlayer: Player = {
            id: socket.id,
            playerNumber: playerNumber as 1 | 2,
            ready: true
        };

        gameRoom.players.push(newPlayer);
        socket.join('main-room');

        socket.emit('playerAssigned', { playerNumber });
        socket.emit('gameStateUpdate', gameRoom.gameState);

        if (gameRoom.players.length === 1) {
            socket.emit('waitingForPlayer');
        } else if (gameRoom.players.length === 2) {
            gameRoom.gameStarted = true;
            io.to('main-room').emit('gameStarted');
            console.log('Game started with 2 players');
        }
    }

    socket.on('paddleMove', (data: { playerNumber: 1 | 2, direction: 'up' | 'down', pressed: boolean }) => {
        const keyState = playerKeyStates[socket.id];
        if (!keyState) return;

        if (data.direction === 'up') {
            keyState.up = data.pressed;
        } else if (data.direction === 'down') {
            keyState.down = data.pressed;
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);

        // Remove player from room
        gameRoom.players = gameRoom.players.filter(p => p.id !== socket.id);
        delete playerKeyStates[socket.id];

        if (gameRoom.players.length < 2) {
            gameRoom.gameStarted = false;

            // Reset game state
            gameRoom.gameState = {
                ball: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED },
                paddles: {
                    player1: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
                    player2: { y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2 }
                },
                score: { player1: 0, player2: 0 },
                gameWidth: GAME_WIDTH,
                gameHeight: GAME_HEIGHT
            };

            if (gameRoom.players.length === 1) {
                io.to('main-room').emit('waitingForPlayer');
                io.to('main-room').emit('gameReset', gameRoom.gameState);
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});