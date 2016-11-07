/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />

module Controllers {
    export class GameController {

        public msg: string;
        public board: Models.CellType[][];
        public gameMode: Models.GameMode;
        public gameOver: boolean;
        public currentPlayer: Models.CellType;

        private _aiPlayer: Models.CellType;
        private _personPlayer: Models.CellType;
        private _moveCount = 0;

        constructor(private _$scope: any, private _c4Service: Services.C4Service) {
            this._$scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in AngularJS!";
            this.board = this._c4Service.createBoard(6, 7);
            this.currentPlayer = Models.CellType.PlayerOne;
            this.gameMode = Models.GameMode.TwoPlayer;
            this.gameOver = false;
            console.log(this.msg);
        }

        public startInGameMode(mode: Models.GameMode) {
            this.gameMode = mode;
            this.resetBoard();

            if (this.gameMode === Models.GameMode.VsAIStandard) {
                this.msg = "Playing versus AI - Standard.";
                this._aiPlayer = this.currentPlayer;
                this._personPlayer = this._aiPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne;
                this.makeAiMove();
                console.log("First Move Made by AI as Player " + this._aiPlayer);
            }
            else if (this.gameMode === Models.GameMode.VsAIHard)
            {
                this.msg = "Sorry, hard mode not yet implemented.";
            }
            else {
                this.msg = "Two player mode. Good luck!";
            }
        }

        private makeAiMove() {
            if (!this.gameOver) {
                let randomMove = Math.floor(Math.random() * 6);
                let aiMoveIndex = this._moveCount === 0 ? Math.floor(this.board[0].length / 2) : randomMove;
                // check for win-condition moves, if found, make it
                for (let i = 0; i < this.board[0].length; i++) {
                    let possibleMoveRowIndex = this.getNextAvailableRowIndex(i);
                    if (possibleMoveRowIndex > -1) {
                        // todo: clean up to re-use makeMove
                        this.board[possibleMoveRowIndex][i] = this._aiPlayer;
                        if (this._c4Service.checkWinConditions(this.board)) {
                            this.endGame();
                            return;
                        }
                        else {
                            this.board[possibleMoveRowIndex][i] = Models.CellType.None;
                        }
                    }
                }
                // check for lose-condition moves open for oponnent, if found, make it
                for (let i = 0; i < this.board[0].length; i++) {
                    let possibleMoveRowIndex = this.getNextAvailableRowIndex(i);
                    if (possibleMoveRowIndex > -1) {
                        this.board[possibleMoveRowIndex][i] = this._personPlayer;
                        if (this._c4Service.checkWinConditions(this.board)) {
                            aiMoveIndex = i;
                        }
                        this.board[possibleMoveRowIndex][i] = Models.CellType.None;
                    }
                }
                // else pick random open move (not smart-mode)
                console.log("AI Move to col. index: " + aiMoveIndex);
                this.makeMove(aiMoveIndex);
            }
        }

        public makeMove(columnIndex: number) {
            let rowIndex = this.getNextAvailableRowIndex(columnIndex);
            this._moveCount++;
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer;
                if (this._c4Service.checkWinConditions(this.board)) {
                    this.endGame();
                }
                this.currentPlayer = this.currentPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }
            if (this.gameMode === Models.GameMode.VsAIStandard && this._aiPlayer === this.currentPlayer) {
                this.makeAiMove();
            }
        }

        private getNextAvailableRowIndex(columnIndex: number): number {
            let rowIndex = -1;

            for (let i = this.board.length - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === Models.CellType.None) {
                    rowIndex = i;
                    break;
                }
            }

            return rowIndex;
        }

        private endGame() {
            let color: string = this.currentPlayer.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            this.msg = "Player " + this.currentPlayer.toString() + "(" + color + ") wins!";
            alert(this.msg);
            this.gameOver = true;
        }

        private resetBoard() {
            this.gameOver = false;
            this._moveCount = 0;
            this.board = this._c4Service.createBoard(6, 7);
        }

        public newGame() {
            this.startInGameMode(this.gameMode);
        }
    }
}