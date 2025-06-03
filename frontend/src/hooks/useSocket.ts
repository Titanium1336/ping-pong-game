import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '../types/game';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameState, setGameState] = useState<GameState>({
        ball: { x: 400, y: 300, dx: 5, dy: 3 },
        paddles: { player1: { y: 250 }, player2: { y: 250 } },
        score: { player1: 0, player2: 0 },
        gameWidth: 800,
        gameHeight: 600
    });
    const [playerNumber, setPlayerNumber] = useState<1 | 2 | null>(null);
    const [waitingForPlayer, setWaitingForPlayer] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io('ws://localhost:3001');

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        socket.on('playerAssigned', (data: { playerNumber: 1 | 2 }) => {
            console.log('Player assigned:', data.playerNumber);
            setPlayerNumber(data.playerNumber);
        });

        socket.on('waitingForPlayer', () => {
            console.log('Waiting for another player');
            setWaitingForPlayer(true);
        });

        socket.on('gameStarted', () => {
            console.log('Game started');
            setWaitingForPlayer(false);
        });

        socket.on('gameStateUpdate', (newGameState: GameState) => {
            setGameState(newGameState);
        });

        socket.on('gameReset', (newGameState: GameState) => {
            console.log('Game reset');
            setGameState(newGameState);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const emitPaddleMove = (direction: 'up' | 'down', pressed: boolean) => {
        if (socketRef.current && playerNumber) {
            socketRef.current.emit('paddleMove', {
                playerNumber,
                direction,
                pressed
            });
        }
    };

    return {
        isConnected,
        gameState,
        playerNumber,
        waitingForPlayer,
        emitPaddleMove
    };
};