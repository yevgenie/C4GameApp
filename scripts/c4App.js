var Models;
(function (Models) {
    (function (CellType) {
        CellType[CellType["None"] = 0] = "None";
        CellType[CellType["PlayerOne"] = 1] = "PlayerOne";
        CellType[CellType["PlayerTwo"] = 2] = "PlayerTwo";
    })(Models.CellType || (Models.CellType = {}));
    var CellType = Models.CellType;
})(Models || (Models = {}));
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />
var Controllers;
(function (Controllers) {
    var GameController = (function () {
        function GameController(_$scope, _c4Service) {
            this._$scope = _$scope;
            this._c4Service = _c4Service;
            this.currentPlayer = Models.CellType.PlayerOne;
            this._moveCount = 0;
            this._$scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in Angular!";
            this.board = this._c4Service.createBoard(6, 7);
            console.log(this.msg);
        }
        GameController.prototype.makeMove = function (columnIndex) {
            var rowIndex = this.getNextAvailableRowIndex(columnIndex);
            this._moveCount++;
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer; // Conversion of Player enum to Cell Enum
                if (this._c4Service.checkWinConditions(this.board)) {
                    this.anounceWinnerAndResetBoard();
                }
                this.currentPlayer = this.currentPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }
        };
        GameController.prototype.getNextAvailableRowIndex = function (columnIndex) {
            var rowIndex = -1;
            for (var i = this.board.length - 1; i >= 0; i--) {
                if (this.board[i][columnIndex] === Models.CellType.None) {
                    rowIndex = i;
                    break;
                }
            }
            return rowIndex;
        };
        GameController.prototype.anounceWinnerAndResetBoard = function () {
            var color = this.currentPlayer.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            alert(color + " wins!");
            this.msg = color + " wins!";
            //reset
            this._moveCount = 0;
            this.board = this._c4Service.createBoard(6, 7);
        };
        return GameController;
    }());
    Controllers.GameController = GameController;
})(Controllers || (Controllers = {}));
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />
var Services;
(function (Services) {
    var C4Service = (function () {
        function C4Service() {
            var _this = this;
            this._winConditionCellCount = 4; // default 4
            this.setWindConditionCellCount = function (count) {
                _this._winConditionCellCount = count;
            };
            this.createBoard = function (height, width) {
                var newBoard = [];
                for (var h = 0; h < height; h++) {
                    var newBoardRow = [];
                    for (var w = 0; w < width; w++) {
                        newBoardRow.push(Models.CellType.None);
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
        }
        C4Service.prototype.checkWinConditions = function (dataBoard) {
            return this.checkHorizontalWinCondition(dataBoard)
                || this.checkHorizontalWinCondition(this.rotateBoard(dataBoard))
                || this.checkDiagonalWinCondition(dataBoard);
        };
        C4Service.prototype.checkHorizontalWinCondition = function (boardData) {
            // check horizontal win conditions
            for (var i = 0; i < boardData.length; i++) {
                var row = boardData[i];
                if (this.checkRowForWin(row)) {
                    return true;
                }
            }
            return false;
        };
        C4Service.prototype.checkDiagonalWinCondition = function (boardData) {
            for (var i = 0; i < boardData.length; i++) {
                var row = boardData[i];
                for (var j = 0; j < row.length; j++) {
                    var diagonalRowDownward = [];
                    var diagonalRowUpward = [];
                    var iCount = i;
                    var jCount = j;
                    while (iCount >= 0 && jCount >= 0) {
                        diagonalRowDownward.push(boardData[iCount][jCount]);
                        diagonalRowUpward.push(boardData[iCount][row.length - 1 - jCount]);
                        iCount--;
                        jCount--;
                    }
                    if (diagonalRowDownward.length > this._winConditionCellCount - 1) {
                        if (this.checkRowForWin(diagonalRowDownward)) {
                            return true;
                        }
                        ;
                    }
                    if (diagonalRowUpward.length > this._winConditionCellCount - 1) {
                        if (this.checkRowForWin(diagonalRowUpward)) {
                            return true;
                        }
                        ;
                    }
                }
            }
            return false;
        };
        C4Service.prototype.checkRowForWin = function (row) {
            var count = 0;
            var previousCell = Models.CellType.None;
            for (var j = 0; j < row.length; j++) {
                var cell = row[j];
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
        };
        return C4Service;
    }());
    Services.C4Service = C4Service;
})(Services || (Services = {}));
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Controllers.ts" />
/// <reference path="C4Service.ts" />
var c4App = angular.module("c4App", []);
c4App.service("c4Service", [function () { return new Services.C4Service(); }]);
c4App.controller("GameController", ["$scope", "c4Service", function ($scope, c4Service) { return new Controllers.GameController($scope, c4Service); }]);
