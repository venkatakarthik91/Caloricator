/// <reference path=".\angular.js"/>
/// <reference path=".\angular-route.js" />
var urlOfCalorieControler = "http://caloricator.azurewebsites.net/api/calorie";
var caloricator = angular.module("caloricator", ["ngRoute", "caloricatorControllers"]);
//Custom drective ng-Blur
caloricator.directive('ngBlur', function () {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            scope.$apply(attrs.ngBlur);
        });
    };
});
var user=null;
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
    //var promise = $http.get("http://caloricator.azurewebsites.net/api/calorie");
    promise.then(function successCallback(response) {
        $scope.benefitsOfCounting = response.data;
    }, function errorCallback(response) {
    });
});

caloricatorControllers.controller("homeController", function ($scope, $http) {
    var cookie = localStorage.getItem("AppAuth");
    if (cookie === null || cookie === undefined || cookie == "") {
        location.href = "#/partials/NewOrExisting.html";
    }
    else {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/user',
            method: "GET",
            headers: { "AppAuth": cookie }
        }).success(function (data, status, headers, config) {
            user = data;
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
    var serverCheck = false;
    $scope.onEmailBlur = function () {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/newuser',
            method: "GET",
            params: { email: $scope.formInfo.email }
        }).success(function (data, status, headers, config) {
            $scope.emailAlreadyExists = data;
            serverCheck = true;
        }).error(function (data, status, headers, config) {

        });
    };
    $scope.onBlur = function () {
        if ($scope.formInfo.firstName == undefined) {
            $scope.firstNameRequired = true;
        }
        else {
            $scope.firstNameRequired = false;
        }
        if ($scope.formInfo.lastName == undefined) {
            $scope.lastNameRequired = true;
        }
        else {
            $scope.lastNameRequired = false;
        }
        if ($scope.formInfo.email == undefined) {
            $scope.emailRequired = true;
        }
        else {
            $scope.emailRequired = false;
        }
        if ($scope.formInfo.password == undefined) {
            $scope.passwordRequired = true;
        }
        else {
            $scope.passwordRequired = false;
        }
        if ($scope.formInfo.confirmPassword == undefined) {
            $scope.confirmPasswordRequired = true;
        }
        else {
            $scope.confirmPasswordRequired = false
        }
        if ($scope.formInfo.dob == undefined) {
            $scope.dobRequired = true;
        }
        else {
            $scope.dobRequired = false;
        }
        if ($scope.formInfo.password != $scope.formInfo.confirmPassword) {
            $scope.matchPasswordRequired = true;
        }
        else {
            $scope.matchPasswordRequired = false;
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
            $scope.strongPasswordRequired = true;
            $scope.passwordError = checkPasswordResult;
        }
        else {
            $scope.strongPasswordRequired = false;
        }
        var CheckInvalidEmail = function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
        if (!CheckInvalidEmail($scope.formInfo.email)) {
            $scope.invalidEmail = true;
        }
        else {
            $scope.invalidEmail = false;
        }

    };
    var noOfTimesInside = 0;
    $scope.Submit = function () {
        $scope.onBlur();
        //Form validation code
        if (!serverCheck) {
            setTimeout(function () {
                noOfTimesInside++;
                if (noOfTimesInside<=1) {
                    $scope.Submit();
                }
                else {
                    alert("Timeout occured.. Please try again later");
                }
            }, 2000);
        }
        if (!($scope.confirmPasswordRequired || $scope.dobRequired || $scope.emailAlreadyExists || $scope.emailRequired || $scope.firstNameRequired || $scope.invalidEmail || $scope.lastNameRequired || $scope.matchPasswordRequired || $scope.passwordRequired || $scope.strongPasswordRequired)) {
            var data2 = JSON.stringify($scope.formInfo);
            $http({
                url: 'http://caloricator.azurewebsites.net/api/newuser',
                method: "POST",
                data: data2

            }).success(function (data, status, headers, config) {
                localStorage.setItem("AppAuth", data);
                location.href = "#/partials/Welcome.html";
            }).error(function (data, status, headers, config) {

            });
        }
        else {
            alert("Please fix all the open issues before submitting");
        }
    };
});
caloricatorControllers.controller("welcomeController", function ($scope, $http) {
    if (user != null) {
        $scope.user = user;
    }
});
