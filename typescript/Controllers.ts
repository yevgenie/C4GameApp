/// <reference path="typings/angularjs/angular.d.ts" />

module Controllers {
    export class GameController {
        public msg: string;

        public board: CellType[][];
        private currentPlayer: CellType = CellType.PlayerOne;
        private winConditionCellCount = 4;

        constructor(private $scope: any) {
            $scope.vm = this;

            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this.createBoard(6, 7);
            console.log(this.msg);
        }

        public createBoard = (height: number, width: number): number[][] => {

            let newBoard: number[][] = [];

            for (let h = 0; h < height; h++) {
                let newBoardRow: number[] = [];
                for (let w = 0; w < width; w++) {
                    newBoardRow.push(CellType.None);
                }
                newBoard.push(newBoardRow);
            }

            return newBoard;
        }

        public makeMove(columnIndex: number) {

            let rowIndex = this.getNextAvailableRowIndex(columnIndex);

            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer; // Conversion of Player enum to Cell Enum
                this.currentPlayer = this.currentPlayer === CellType.PlayerOne ? CellType.PlayerTwo : CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }

            this.checkWinConditions();
        }

        private getNextAvailableRowIndex(columnIndex: number): number {

            let rowIndex = -1;

            for (let i = this.board.length - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === CellType.None) {
                    rowIndex = i;
                    break;
                }
            }

            return rowIndex;
        }

        private checkWinConditions() {
            // check horizontal win conditions
            this.board.forEach((row) => {
                let count = 0;
                let currentPlayer: CellType;

                row.forEach((cell) => {
                    if (cell !== CellType.None && (cell === currentPlayer || count === 0)) {
                        currentPlayer = cell;
                        count++;
                        if(count == this.winConditionCellCount)
                        {
                            console.log(currentPlayer.toString() + " wins!");
                            //reset
                            this.board = this.createBoard(6, 7);
                        }
                    }
                });
            });
        }
    }

    enum CellType {
        None,
        PlayerOne,
        PlayerTwo
    }
}