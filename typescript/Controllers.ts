/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />

module Controllers {
    export class GameController {

        public msg: string;
        public board: Models.CellType[][];
        public currentPlayer: Models.CellType = Models.CellType.PlayerOne;
        private _moveCount = 0;


        constructor(private _$scope: any, private _c4Service: Services.C4Service) {
            this._$scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this._c4Service.createBoard(6, 7);
            console.log(this.msg);
        }

        public makeMove(columnIndex: number) {
            let rowIndex = this.getNextAvailableRowIndex(columnIndex);
            this._moveCount++;
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer;
                if (this._c4Service.checkWinConditions(this.board)) {
                    this.anounceWinnerAndResetBoard();
                }
                this.currentPlayer = this.currentPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne; // To support more than one player, this needs to be more robust
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

        private anounceWinnerAndResetBoard() {
            let color: string = this.currentPlayer.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            alert(color + " wins!");
            this.msg = color + " wins!";
            //reset
            this._moveCount = 0;
            this.board = this._c4Service.createBoard(6, 7);
        }
    }
}