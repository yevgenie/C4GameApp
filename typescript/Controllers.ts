/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />

module Controllers {
    export class GameController {

        public msg: string;
        public board: Models.CellType[][];
        public gameMode: Models.GameMode;
        public currentPlayer: Models.CellType = Models.CellType.PlayerOne;
        private aiPlayer: Models.CellType;
        private _moveCount = 0;
        
        constructor(private _$scope: any, private _c4Service: Services.C4Service) {
            this._$scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this._c4Service.createBoard(6, 7);
            this.gameMode = Models.GameMode.TwoPlayer;
            console.log(this.msg);
        }

        public changeGameMode(mode: Models.GameMode) {
            this.gameMode = mode;
            this.resetBoard();

            if(this.gameMode === Models.GameMode.VsAIStandard)
            {
                // first pass, AI always makes first move to center
                let firstMoveIndex = Math.floor(this.board[0].length / 2);
                this.aiPlayer = this.currentPlayer;
                this.makeMove(firstMoveIndex);
                console.log("First Move Made by AI as Player " + this.aiPlayer);
            }
        }

        public makeMove(columnIndex: number) {
            let rowIndex = this.getNextAvailableRowIndex(columnIndex);
            this._moveCount++;
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer;
                if (this._c4Service.checkWinConditions(this.board)) {
                    this.anounceWinner();
                }
                this.currentPlayer = this.currentPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }

            if(this.gameMode === Models.GameMode.VsAIStandard && this.aiPlayer === this.currentPlayer)
            {
                // check for win-condition moves, if found, make it
                // check for lose-condition moves open for oponnent, if found, make it
                // pick random open move (not smart-mode)
                this.makeMove(Math.floor(this.board[0].length / 2));
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

        private anounceWinner() {
            let color: string = this.currentPlayer.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            alert(color + " wins!");
            this.msg = color + " wins!";
            this.resetBoard();
        }

        private resetBoard() {
            this._moveCount = 0;
            this.board = this._c4Service.createBoard(6, 7);
        }
    }
}