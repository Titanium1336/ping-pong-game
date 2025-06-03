export interface GameState {
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
    };
    paddles: {
        player1: {
            y: number;
        };
        player2: {
            y: number;
        };
    };
    score: {
        player1: number;
        player2: number;
    };
    gameWidth: number;
    gameHeight: number;
}

export interface Player {
    id: string;
    playerNumber: 1 | 2;
    ready: boolean;
}

export interface GameRoom {
    id: string;
    players: Player[];
    gameState: GameState;
    gameStarted: boolean;
}

export interface KeyState {
    up: boolean;
    down: boolean;
}