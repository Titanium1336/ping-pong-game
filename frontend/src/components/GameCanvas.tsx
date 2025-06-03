import React, { useRef, useEffect, useCallback } from 'react';
import type { GameState } from '../types/game';

interface GameCanvasProps {
    gameState: GameState;
    playerNumber: 1 | 2 | null;
    onKeyDown: (key: string) => void;
    onKeyUp: (key: string) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
    gameState,
    playerNumber,
    onKeyDown,
    onKeyUp
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (playerNumber === 1 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault();
            onKeyDown(e.key);
        } else if (playerNumber === 2 && (e.key === 'w' || e.key === 's')) {
            e.preventDefault();
            onKeyDown(e.key);
        }
    }, [playerNumber, onKeyDown]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (playerNumber === 1 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault();
            onKeyUp(e.key);
        } else if (playerNumber === 2 && (e.key === 'w' || e.key === 's')) {
            e.preventDefault();
            onKeyUp(e.key);
        }
    }, [playerNumber, onKeyUp]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#0f0f23';
        ctx.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight);

        // Draw center line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(gameState.gameWidth / 2, 0);
        ctx.lineTo(gameState.gameWidth / 2, gameState.gameHeight);
        ctx.stroke();

        // Draw paddles
        const paddleWidth = 10;
        const paddleHeight = 100;

        // Player 1 paddle (left)
        ctx.fillStyle = playerNumber === 1 ? '#00ff88' : '#0088ff';
        ctx.fillRect(20, gameState.paddles.player1.y, paddleWidth, paddleHeight);

        // Player 2 paddle (right)
        ctx.fillStyle = playerNumber === 2 ? '#00ff88' : '#ff0088';
        ctx.fillRect(gameState.gameWidth - 30, gameState.paddles.player2.y, paddleWidth, paddleHeight);

        // Draw ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect to ball
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

    }, [gameState, playerNumber]);

    return (
        <canvas
            ref={canvasRef}
            width={gameState.gameWidth}
            height={gameState.gameHeight}
            className="border-2 border-purple-500 rounded-lg bg-gray-900 shadow-2xl"
            tabIndex={0}
        />
    );
};

export default GameCanvas;