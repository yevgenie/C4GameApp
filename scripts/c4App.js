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
            var _this = this;
            // check horizontal win conditions
            this.board.forEach(function (row) {
                var count = 0;
                var currentPlayer;
                row.forEach(function (cell) {
                    if (cell !== CellType.None && (cell === currentPlayer || count === 0)) {
                        currentPlayer = cell;
                        count++;
                        if (count == _this.winConditionCellCount) {
                            console.log(currentPlayer.toString() + " wins!");
                            //reset
                            _this.board = _this.createBoard(6, 7);
                        }
                    }
                });
            });
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
