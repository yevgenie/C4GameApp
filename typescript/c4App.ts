/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="Controllers.ts" />
/// <reference path="C4Service.ts" />

var c4App: angular.IModule = angular.module("c4App", []);

c4App.service("c4Service", [() => new Services.C4Service()]);
c4App.controller("GameController", ["$scope", "c4Service", ($scope, c4Service) => new Controllers.GameController($scope, c4Service)]);
