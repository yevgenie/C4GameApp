var Models;
(function (Models) {
    (function (CellType) {
        CellType[CellType["None"] = 0] = "None";
        CellType[CellType["PlayerOne"] = 1] = "PlayerOne";
        CellType[CellType["PlayerTwo"] = 2] = "PlayerTwo";
    })(Models.CellType || (Models.CellType = {}));
    var CellType = Models.CellType;
    (function (GameMode) {
        GameMode[GameMode["TwoPlayer"] = 0] = "TwoPlayer";
        GameMode[GameMode["VsAIStandard"] = 1] = "VsAIStandard";
        GameMode[GameMode["VsAIHard"] = 2] = "VsAIHard";
    })(Models.GameMode || (Models.GameMode = {}));
    var GameMode = Models.GameMode;
})(Models || (Models = {}));
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Models.ts" />
var Controllers;
(function (Controllers) {
    var GameController = (function () {
        function GameController(_$scope, _c4Service) {
            this._$scope = _$scope;
            this._c4Service = _c4Service;
            this._moveCount = 0;
            this._$scope.vm = this;
            this.msg = "Welcome to Connect 4 Game in AngularJS!";
            this.board = this._c4Service.createBoard(6, 7);
            this.currentPlayer = Models.CellType.PlayerOne;
            this.gameMode = Models.GameMode.TwoPlayer;
            this.gameOver = false;
            console.log(this.msg);
        }
        GameController.prototype.startInGameMode = function (mode) {
            this.gameMode = mode;
            this.resetBoard();
            if (this.gameMode === Models.GameMode.VsAIStandard) {
                this.msg = "Playing versus AI - Standard.";
                this._aiPlayer = this.currentPlayer;
                this._personPlayer = this._aiPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne;
                this.makeAiMove();
                console.log("First Move Made by AI as Player " + this._aiPlayer);
            }
            else if (this.gameMode === Models.GameMode.VsAIHard) {
                this.msg = "Sorry, hard mode not yet implemented.";
            }
            else {
                this.msg = "Two player mode. Good luck!";
            }
        };
        GameController.prototype.makeAiMove = function () {
            if (!this.gameOver) {
                var randomMove = Math.floor(Math.random() * 6);
                var aiMoveIndex = this._moveCount === 0 ? Math.floor(this.board[0].length / 2) : randomMove;
                // check for win-condition moves, if found, make it
                for (var i = 0; i < this.board[0].length; i++) {
                    var possibleMoveRowIndex = this.getNextAvailableRowIndex(i);
                    if (possibleMoveRowIndex > -1) {
                        // todo: clean up to re-use makeMove
                        this.board[possibleMoveRowIndex][i] = this._aiPlayer;
                        if (this._c4Service.checkWinConditions(this.board)) {
                            this.endGame();
                            return;
                        }
                        else {
                            this.board[possibleMoveRowIndex][i] = Models.CellType.None;
                        }
                    }
                }
                // check for lose-condition moves open for oponnent, if found, make it
                for (var i = 0; i < this.board[0].length; i++) {
                    var possibleMoveRowIndex = this.getNextAvailableRowIndex(i);
                    if (possibleMoveRowIndex > -1) {
                        this.board[possibleMoveRowIndex][i] = this._personPlayer;
                        if (this._c4Service.checkWinConditions(this.board)) {
                            aiMoveIndex = i;
                        }
                        this.board[possibleMoveRowIndex][i] = Models.CellType.None;
                    }
                }
                // pick random open move (not smart-mode)
                console.log("AI Move to col. index: " + aiMoveIndex);
                this.makeMove(aiMoveIndex);
            }
        };
        GameController.prototype.makeMove = function (columnIndex) {
            var rowIndex = this.getNextAvailableRowIndex(columnIndex);
            this._moveCount++;
            if (rowIndex !== -1) {
                this.board[rowIndex][columnIndex] = this.currentPlayer;
                if (this._c4Service.checkWinConditions(this.board)) {
                    this.endGame();
                }
                this.currentPlayer = this.currentPlayer === Models.CellType.PlayerOne ? Models.CellType.PlayerTwo : Models.CellType.PlayerOne; // To support more than one player, this needs to be more robust
            }
            if (this.gameMode === Models.GameMode.VsAIStandard && this._aiPlayer === this.currentPlayer) {
                this.makeAiMove();
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
        GameController.prototype.endGame = function () {
            var color = this.currentPlayer.toString() === '1' ? 'RED' : 'BLUE'; // todo move to player:color assignment
            this.msg = "Player " + this.currentPlayer.toString() + "(" + color + ") wins!";
            alert(this.msg);
            this.gameOver = true;
        };
        GameController.prototype.resetBoard = function () {
            this.gameOver = false;
            this._moveCount = 0;
            this.board = this._c4Service.createBoard(6, 7);
        };
        GameController.prototype.newGame = function () {
            this.startInGameMode(this.gameMode);
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
