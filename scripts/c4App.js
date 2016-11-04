/// <reference path="typings/angularjs/angular.d.ts" />
var Controllers;
(function (Controllers) {
    var GameController = (function () {
        function GameController($scope) {
            this.$scope = $scope;
            this.currentPlayer = Players.PlayerOne;
            this.createBoard = function (height, width) {
                var newBoard = [];
                for (var h = 0; h < height; h++) {
                    var newBoardRow = [];
                    for (var w = 0; w < width; w++) {
                        newBoardRow.push(Cell.Empty);
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
                this.board[rowIndex][columnIndex] = Cell[Players[this.currentPlayer]]; // Conversion of Player enum to Cell Enum
                this.currentPlayer = this.currentPlayer === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne; // To support more than one player, this needs to be more robust
            }
        };
        GameController.prototype.getNextAvailableRowIndex = function (columnIndex) {
            var rowIndex = -1;
            for (var i = this.board.length - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === Cell.Empty) {
                    rowIndex = i;
                    break;
                }
                console.log(i);
            }
            return rowIndex;
        };
        GameController.prototype.checkWinConditions = function () {
            //todo
        };
        return GameController;
    }());
    Controllers.GameController = GameController;
    var Cell;
    (function (Cell) {
        Cell[Cell["Empty"] = 0] = "Empty";
        Cell[Cell["PlayerOne"] = 1] = "PlayerOne";
        Cell[Cell["PlayerTwo"] = 2] = "PlayerTwo";
    })(Cell || (Cell = {}));
    var Players;
    (function (Players) {
        Players[Players["PlayerOne"] = 0] = "PlayerOne";
        Players[Players["PlayerTwo"] = 1] = "PlayerTwo";
    })(Players || (Players = {}));
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
