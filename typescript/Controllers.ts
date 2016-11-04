/// <reference path="typings/angularjs/angular.d.ts" />

module Controllers {
    export class GameController {
        public msg: string;

        public board: Cell[][];
        private currentPlayer: Players = Players.PlayerOne;

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
                    newBoardRow.push(Cell.Empty);
                }
                newBoard.push(newBoardRow);
            }

            return newBoard;
        }

        public makeMove(columnIndex: number) {

            let rowIndex = this.getNextAvailableRowIndex(columnIndex);

            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = Cell[Players[this.currentPlayer]]; // Conversion of Player enum to Cell Enum
                this.currentPlayer = this.currentPlayer === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne; // To support more than one player, this needs to be more robust
            }
        }

        private getNextAvailableRowIndex(columnIndex: number): number {

            let rowIndex = -1;

            for(let i = this.board.length - 1; i >= 0; i--)
            {
                if(this.board[i][columnIndex] === Cell.Empty)
                {
                    rowIndex = i;
                    break;
                }
                console.log(i);
            }
            
            return rowIndex;
        }

        private checkWinConditions()
        {
            //todo
        }
    }

    enum Cell {
        Empty,
        PlayerOne,
        PlayerTwo
    }

    enum Players {
        PlayerOne,
        PlayerTwo
    }
}