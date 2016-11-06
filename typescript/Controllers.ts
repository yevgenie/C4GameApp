/// <reference path="typings/angularjs/angular.d.ts" />

module Controllers {
    export class GameController {

        public msg: string;
        public board: CellType[][];
        public currentPlayer: CellType = CellType.PlayerOne;

        private winConditionCellCount = 4;

        constructor(private $scope: any) {
            $scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this.createBoard(6, 7);
            console.log(this.msg);
        }

        private createBoard = (height: number, width: number): number[][] => {
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

        private rotateBoard = (boardData: CellType[][]): CellType[][] => {
            let rotatedBoard: CellType[][] = [];
            let height = boardData[0].length;
            let width = boardData.length;

            for (let h = 0; h < height; h++) {
                let newBoardRow: number[] = [];
                for (let w = 0; w < width; w++) {
                    newBoardRow.push(boardData[w][h]);
                }
                rotatedBoard.push(newBoardRow);
            }

            return rotatedBoard;
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

        private checkWinConditions(): boolean {
            return this.checkHorizontalWinCondition(this.board)
            || this.checkHorizontalWinCondition(this.rotateBoard(this.board))
            || this.checkDiagonalWinCondition(this.board);
        }

        private checkHorizontalWinCondition(boardData: CellType[][]): boolean {
            // check horizontal win conditions
            for (let i = 0; i < boardData.length; i++) {
                let row = boardData[i];
                if(this.checkRowForWin(row))
                {
                    return true;
                }
            }
            return false;
        }

        private checkDiagonalWinCondition(boardData: CellType[][]): boolean {
            for (let i = 0; i < boardData.length; i++) {
                let row = boardData[i];
                for (let j = 0; j < row.length; j++) {
                        let diagonalRowDownward: CellType[] = [];
                        let diagonalRowUpward: CellType[] = [];
                        let iCount = i;
                        let jCount = j;
                        while(iCount >= 0 && jCount >= 0) {
                            diagonalRowDownward.push(boardData[iCount][jCount]);
                            diagonalRowUpward.push(boardData[iCount][row.length - 1 - jCount]);
                            iCount--;
                            jCount--;
                        }

                        if(diagonalRowDownward.length > this.winConditionCellCount - 1) {
                            if(this.checkRowForWin(diagonalRowDownward)) {
                                return true;
                            };
                        }
                        if(diagonalRowUpward.length > this.winConditionCellCount - 1) {
                            if(this.checkRowForWin(diagonalRowUpward)) {
                                return true;
                            };
                        }
                }
            }
            return false;
        }

        private checkRowForWin(row: CellType[]): boolean {
            let count = 0;
            let previousCell: CellType = CellType.None;

            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                if (cell !== previousCell || cell === CellType.None)
                {
                    count = 0;
                    previousCell = cell;
                }
                else
                {
                    count++;
                    if (count == this.winConditionCellCount - 1) {
                        this.anounceWinnerAndResetBoard(previousCell);
                        return true;
                    }
                }
            }
            return false;
        }

        private anounceWinnerAndResetBoard(player: CellType) {
            let color: string = player.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            console.log(color + " wins!");
            this.msg = color + " wins!";
            //reset
            this.board = this.createBoard(6, 7);
        }
    }

    enum CellType {
        None,
        PlayerOne,
        PlayerTwo
    }
}