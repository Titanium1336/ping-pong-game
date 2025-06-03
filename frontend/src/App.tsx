import { useSocket } from './hooks/useSocket';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import './App.css';

function App() {
  const { isConnected, gameState, playerNumber, waitingForPlayer, emitPaddleMove } = useSocket();

  const handleKeyDown = (key: string) => {
    switch (key) {
      case 'ArrowUp':
        emitPaddleMove('up', true);
        break;
      case 'ArrowDown':
        emitPaddleMove('down', true);
        break;
      case 'w':
        emitPaddleMove('up', true);
        break;
      case 's':
        emitPaddleMove('down', true);
        break;
    }
  };

  const handleKeyUp = (key: string) => {
    switch (key) {
      case 'ArrowUp':
        emitPaddleMove('up', false);
        break;
      case 'ArrowDown':
        emitPaddleMove('down', false);
        break;
      case 'w':
        emitPaddleMove('up', false);
        break;
      case 's':
        emitPaddleMove('down', false);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <GameUI
        gameState={gameState}
        playerNumber={playerNumber}
        isConnected={isConnected}
        waitingForPlayer={waitingForPlayer}
      />
      
      <div className="flex justify-center">
        <GameCanvas
          gameState={gameState}
          playerNumber={playerNumber}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center max-w-2xl">
        <h2 className="text-lg font-semibold text-white mb-2">How to Play</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="bg-blue-500/20 border border-blue-500 rounded p-3">
            <h3 className="font-semibold text-blue-400">Player 1 (Left)</h3>
            <p>Use Arrow Keys ↑↓ to move your paddle</p>
          </div>
          <div className="bg-pink-500/20 border border-pink-500 rounded p-3">
            <h3 className="font-semibold text-pink-400">Player 2 (Right)</h3>
            <p>Use W/S keys to move your paddle</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;