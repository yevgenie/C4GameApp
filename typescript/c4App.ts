/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Controllers.ts" />

var c4App: angular.IModule = angular.module("c4App", []);

c4App.controller("GameController", ["$scope", ($scope) => new Controllers.GameController($scope)]);

// class Startup {
//     public static main(): number {
//         console.log('Hello World');
//         return 0;
//     }
// }

// Startup.main();