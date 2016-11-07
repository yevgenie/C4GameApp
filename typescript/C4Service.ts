/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />

module Services {
    export class C4Service {

        private _winConditionCellCount = 4; // default 4

        constructor() {
        }

        public setWinConditionCellCount = (count: number) => {
            this._winConditionCellCount = count;
        }

        public createBoard = (height: number, width: number): number[][] => {
            let newBoard: number[][] = [];

            for (let h = 0; h < height; h++) {
                let newBoardRow: number[] = [];
                for (let w = 0; w < width; w++) {
                    newBoardRow.push(Models.CellType.None);
                }
                newBoard.push(newBoardRow);
            }

            return newBoard;
        }

        private rotateBoard = (boardData: Models.CellType[][]): Models.CellType[][] => {
            let rotatedBoard: Models.CellType[][] = [];
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
     
        public checkWinConditions(dataBoard: Models.CellType[][]): boolean {
            return this.checkHorizontalWinCondition(dataBoard)
                || this.checkHorizontalWinCondition(this.rotateBoard(dataBoard))
                || this.checkDiagonalWinCondition(dataBoard);
        }

        private checkHorizontalWinCondition(boardData: Models.CellType[][]): boolean {
            // check horizontal win conditions
            for (let i = 0; i < boardData.length; i++) {
                let row = boardData[i];
                if (this.checkRowForWin(row)) {
                    return true;
                }
            }
            return false;
        }

        private checkDiagonalWinCondition(boardData: Models.CellType[][]): boolean {
            for (let i = 0; i < boardData.length; i++) {
                let row = boardData[i];
                for (let j = 0; j < row.length; j++) {
                    let diagonalRowDownward: Models.CellType[] = [];
                    let diagonalRowUpward: Models.CellType[] = [];
                    let iCount = i;
                    let jCount = j;
                    while (iCount >= 0 && jCount >= 0) {
                        diagonalRowDownward.push(boardData[iCount][jCount]);
                        diagonalRowUpward.push(boardData[iCount][row.length - 1 - jCount]);
                        iCount--;
                        jCount--;
                    }

                    if (diagonalRowDownward.length > this._winConditionCellCount - 1) {
                        if (this.checkRowForWin(diagonalRowDownward)) {
                            return true;
                        };
                    }
                    if (diagonalRowUpward.length > this._winConditionCellCount - 1) {
                        if (this.checkRowForWin(diagonalRowUpward)) {
                            return true;
                        };
                    }
                }
            }
            return false;
        }

        private checkRowForWin(row: Models.CellType[]): boolean {
            let count = 0;
            let previousCell: Models.CellType = Models.CellType.None;

            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                if (cell !== previousCell || cell === Models.CellType.None) {
                    count = 0;
                    previousCell = cell;
                }
                else {
                    count++;
                    if (count == this._winConditionCellCount - 1) {
                        //this.anounceWinnerAndResetBoard(previousCell);
                        return true;
                    }
                }
            }
            return false;
        }

    }
}