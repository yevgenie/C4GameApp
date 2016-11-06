/// <reference path="typings/angularjs/angular.d.ts" />
var Controllers;
(function (Controllers) {
    var GameController = (function () {
        function GameController($scope) {
            this.$scope = $scope;
            this.currentPlayer = CellType.PlayerOne;
            this.winConditionCellCount = 4;
            this.createBoard = function (height, width) {
                var newBoard = [];
                for (var h = 0; h < height; h++) {
                    var newBoardRow = [];
                    for (var w = 0; w < width; w++) {
                        newBoardRow.push(CellType.None);
                    }
                    newBoard.push(newBoardRow);
                }
                return newBoard;
            };
            this.rotateBoard = function (boardData) {
                var rotatedBoard = [];
                var height = boardData[0].length;
                var width = boardData.length;
                for (var h = 0; h < height; h++) {
                    var newBoardRow = [];
                    for (var w = 0; w < width; w++) {
                        newBoardRow.push(boardData[w][h]);
                    }
                    rotatedBoard.push(newBoardRow);
                }
                return rotatedBoard;
            };
            $scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this.createBoard(6, 7);
            console.log(this.msg);
        }
        GameController.prototype.makeMove = function (columnIndex) {
            var rowIndex = this.getNextAvailableRowIndex(columnIndex);
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer; // Conversion of Player enum to Cell Enum
                this.currentPlayer = this.currentPlayer === CellType.PlayerOne ? CellType.PlayerTwo : CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }
            this.checkWinConditions();
        };
        GameController.prototype.getNextAvailableRowIndex = function (columnIndex) {
            var rowIndex = -1;
            for (var i = this.board.length - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === CellType.None) {
                    rowIndex = i;
                    break;
                }
            }
            return rowIndex;
        };
        GameController.prototype.checkWinConditions = function () {
            return this.checkHorizontalWinCondition(this.board)
                || this.checkHorizontalWinCondition(this.rotateBoard(this.board))
                || this.checkVerticalWinCondition(this.board);
        };
        GameController.prototype.checkHorizontalWinCondition = function (boardData) {
            // check horizontal win conditions
            for (var i = 0; i < boardData.length; i++) {
                var row = boardData[i];
                if (this.checkRowForWin(row)) {
                    return true;
                }
            }
            return false;
        };
        GameController.prototype.checkVerticalWinCondition = function (boardData) {
            var acceptableIndex = this.winConditionCellCount - 1;
            for (var i = 0; i < boardData.length; i++) {
                var row = boardData[i];
                for (var j = 0; j < row.length; j++) {
                    if (i >= acceptableIndex || j >= acceptableIndex) {
                        var verticalRow = [];
                        var iCount = i;
                        var jCount = j;
                        while (iCount >= 0 && jCount >= 0) {
                            verticalRow.push(boardData[iCount][jCount]);
                            iCount--;
                            jCount--;
                        }
                        if (verticalRow.length > 0) {
                            console.log(verticalRow);
                        }
                    }
                }
            }
            return false;
        };
        GameController.prototype.checkRowForWin = function (row) {
            var count = 0;
            var previousCell = CellType.None;
            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
                if (cell !== previousCell || cell === CellType.None) {
                    count = 0;
                    previousCell = cell;
                }
                else {
                    count++;
                    if (count == this.winConditionCellCount - 1) {
                        this.anounceWinnerAndResetBoard(previousCell);
                        return true;
                    }
                }
            }
            return false;
        };
        GameController.prototype.anounceWinnerAndResetBoard = function (player) {
            var color = player.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            console.log(color + " wins!");
            this.msg = color + " wins!";
            //reset
            this.board = this.createBoard(6, 7);
        };
        return GameController;
    }());
    Controllers.GameController = GameController;
    var CellType;
    (function (CellType) {
        CellType[CellType["None"] = 0] = "None";
        CellType[CellType["PlayerOne"] = 1] = "PlayerOne";
        CellType[CellType["PlayerTwo"] = 2] = "PlayerTwo";
    })(CellType || (CellType = {}));
})(Controllers || (Controllers = {}));
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Controllers.ts" />
var c4App = angular.module("c4App", []);
c4App.controller("GameController", ["$scope", function ($scope) { return new Controllers.GameController($scope); }]);
// class Startup {
//     public static main(): number {
//         console.log('Hello World');
//         return 0;
//     }
// }
// Startup.main(); 
