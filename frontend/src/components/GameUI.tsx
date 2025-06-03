import React from 'react';
import type { GameState } from '../types/game';

interface GameUIProps {
    gameState: GameState;
    playerNumber: 1 | 2 | null;
    isConnected: boolean;
    waitingForPlayer: boolean;
}

const GameUI: React.FC<GameUIProps> = ({
    gameState,
    playerNumber,
    isConnected,
    waitingForPlayer
}) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header with scores */}
            <div className="flex justify-between items-center mb-6 px-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Player 1</h3>
                    <div className="text-4xl font-bold text-white bg-blue-500 rounded-lg px-4 py-2 min-w-[80px]">
                        {gameState.score.player1}
                    </div>
                    {playerNumber === 1 && (
                        <p className="text-sm text-green-400 mt-2">You (Arrow Keys)</p>
                    )}
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">PING PONG</h1>
                    <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-400">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold text-pink-400 mb-2">Player 2</h3>
                    <div className="text-4xl font-bold text-white bg-pink-500 rounded-lg px-4 py-2 min-w-[80px]">
                        {gameState.score.player2}
                    </div>
                    {playerNumber === 2 && (
                        <p className="text-sm text-green-400 mt-2">You (W/S Keys)</p>
                    )}
                </div>
            </div>

            {/* Status messages */}
            {waitingForPlayer && (
                <div className="text-center mb-4">
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                        <p className="text-yellow-300 font-semibold">Waiting for another player to join...</p>
                    </div>
                </div>
            )}

            {!isConnected && (
                <div className="text-center mb-4">
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                        <p className="text-red-300 font-semibold">Connection lost. Attempting to reconnect...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameUI;