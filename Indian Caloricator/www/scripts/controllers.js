/// <reference path=".\angular.js" />
var caloricator = angular.module("caloricator", []);

caloricator.controller("CaloricatorController", function ($scope, $http) {
    var promise = $http.get("http://caloricator.azurewebsites.net/api/calorie");
    promise.then(function successCallback(response) {
        $scope.benefitsOfCounting = response.data;
    }, function errorCallback(response) {
    });
});