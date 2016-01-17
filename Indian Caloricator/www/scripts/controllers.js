/// <reference path=".\angular.js"/>
/// <reference path=".\angular-route.js" />
var urlOfCalorieControler = "http://caloricator.azurewebsites.net/api/calorie";
var caloricator = angular.module("caloricator", ["ngRoute", "caloricatorControllers"]);
var firstName = null;
caloricator.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/home.html'//,
        //controller: 'CaloricatorController'
    }).when('/partials/NewOrExisting.html', {
        templateUrl: 'partials/NewOrExisting.html'
    }).when('/partials/NewUser.html', {
        templateUrl: 'partials/NewUser.html'
    }).when('/partials/Welcome.html', {
        templateUrl: 'partials/Welcome.html'
    });
});
var caloricatorControllers = angular.module("caloricatorControllers", []);

caloricatorControllers.controller("CaloricatorController", function ($scope, $http) {
    var promise = $http.get(urlOfCalorieControler);
    //var promise = $http.get("http://localhost:48046/api/calorie");
    promise.then(function successCallback(response) {
        $scope.benefitsOfCounting = response.data;
    }, function errorCallback(response) {
    });
});

caloricatorControllers.controller("homeController", function ($scope, $http) {
    var cookie = localStorage.getItem("AppAuth");
    if (cookie == null) {
        location.href = "#/partials/NewOrExisting.html";
    }
    else {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/user',
            method: "GET",
            headers: { "AppAuth": cookie }
        }).success(function (data, status, headers, config) {
            firstName = data;
            location.href = "#/partials/Welcome.html";
        }).error(function (data, status, headers, config) {
            $scope.errorMessage = status;
        });
    }
});
caloricatorControllers.controller("newOrExistingUserController", function ($scope, $http) {
    $scope.navigateToNewUser = function () {
        location.href = "#/partials/NewUser.html";
    }
});

caloricatorControllers.controller("newUserController", function ($scope, $http) {
    $scope.formInfo = {};
    var resetToDefaults = function () {
        $scope.firstNameRequired = false;
        $scope.lastNameRequired = false;
        $scope.emailRequired = false;
        $scope.passwordRequired = false;
        $scope.strongPasswordRequired = false;
        $scope.confirmPasswordRequired = false;
        $scope.matchPasswordRequired = false;
        $scope.ageRequired = false;
    };
    resetToDefaults();
    $scope.Submit = function () {
        resetToDefaults();
        var request = {};
        var validationError = false;
        //Form validation code
        if ($scope.formInfo.firstName == undefined) {
            $scope.firstNameRequired = validationError = true;
        }
        if ($scope.formInfo.lastName == undefined) {
            $scope.lastNameRequired = validationError = true;
        }
        if ($scope.formInfo.email == undefined) {
            $scope.emailRequired = validationError = true;
        }
        if ($scope.formInfo.password == undefined) {
            $scope.passwordRequired = validationError = true;
        }
        if ($scope.formInfo.confirmPassword == undefined) {
            $scope.confirmPasswordRequired = validationError = true;
        }
        if ($scope.formInfo.age == undefined) {
            $scope.ageRequired = validationError = true;
        }
        if ($scope.formInfo.password != $scope.formInfo.confirmPassword) {
            $scope.matchPasswordRequired = validationError = true;
        }
        var checkPassword = function (str) {
            if (str.length < 6) {
                return ("password is too short");
            } else if (str.length > 50) {
                return ("password is too long");
            } else if (str.search(/\d/) == -1) {
                return ("password should contain a number");
            } else if (str.search(/[a-zA-Z]/) == -1) {
                return ("password should contain a letter");
            } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
                return ("password contains an invalid character");
            }
            return ("ok");
        }
        var checkPasswordResult = checkPassword($scope.formInfo.password);
        if (checkPasswordResult != "ok") {
            $scope.strongPasswordRequired = validationError = true;
            $scope.passwordError = checkPasswordResult;
        }
        var CheckInvalidEmail = function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
        if (!CheckInvalidEmail($scope.formInfo.email)) {
            $scope.invalidEmail = validationError = true;
        }
        if (validationError) {
            return;
        }
        var data2 = JSON.stringify($scope.formInfo);
        $http({
            url: 'http://caloricator.azurewebsites.net/api/newuser',
            method: "POST",
            data: data2

        }).success(function (data, status, headers, config) {
            localStorage.setItem("AppAuth", data);
            location.href = "#/partials/Welcome.html";
        }).error(function (data, status, headers, config) {
            var x = 9;
        });
    };
});
caloricatorControllers.controller("welcomeController", function ($scope, $http) {
    if (firstName==null) {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/user',
            method: "GET",
            headers: { "AppAuth": cookie }
        }).success(function (data, status, headers, config) {
            firstName = data;
        }).error(function (data, status, headers, config) {
            $scope.errorMessage = status;
        });
    }
    if (firstName != null) {
        $scope.firstName = firstName;
    }
});
