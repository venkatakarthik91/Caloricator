﻿/// <reference path=".\angular.js"/>
/// <reference path=".\angular-route.js" />
var caloricator = angular.module("caloricator", ["ngRoute", "caloricatorControllers"]);
caloricator.config(function ($routeProvider) {
    $routeProvider.when('/', {
          templateUrl: 'partials/newuser.html'//,
          //controller: 'CaloricatorController'
      }).otherwise({
          templateUrl: 'partials/home.html'
      });
});
var caloricatorControllers = angular.module("caloricatorControllers", []);
caloricatorControllers.controller("CaloricatorController", function ($scope, $http) {
    //var promise = $http.get("http://caloricator.azurewebsites.net/api/calorie");
    var promise = $http.get("http://localhost:48046/api/calorie");
    promise.then(function successCallback(response) {
        $scope.benefitsOfCounting = response.data;
    }, function errorCallback(response) {
    });
});
