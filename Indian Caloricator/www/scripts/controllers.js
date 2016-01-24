/// <reference path=".\angular.js"/>
/// <reference path=".\angular-route.js" />
var caloricator = angular.module("caloricator", ["ngRoute", "caloricatorControllers"]);
//Custom drective ng-Blur
caloricator.directive('ngBlur', function () {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            scope.$apply(attrs.ngBlur);
        });
    };
});
var user = null;
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
    }).when('/partials/AddCalories.html', {
        templateUrl: 'partials/AddCalories.html'
    }).when('/partials/DisplayCalories.html', {
        templateUrl: 'partials/DisplayCalories.html'
    });
});
var caloricatorControllers = angular.module("caloricatorControllers", []);

caloricatorControllers.controller("CaloricatorController", function ($scope, $http) {
    var promise = $http.get("http://localhost:48046/api/calorie");
    promise.then(function successCallback(response) {
        $scope.benefitsOfCounting = response.data;
    }, function errorCallback(response) {
    });
});
caloricator.service("cookie", function () {
    return {
        getCookie: function () { return localStorage.getItem("AppAuth") },
        setCookie: function (value) { localStorage.setItem("AppAuth", value) }
    };
});
caloricatorControllers.controller("homeController", function ($scope, $http, cookie) {
    if (cookie.getCookie() === null || cookie.getCookie() === undefined || cookie.getCookie() == "") {
        location.href = "#/partials/NewOrExisting.html";
    }
    else {
        $http({
            url: 'http://localhost:48046/api/user',
            method: "GET",
            headers: { "AppAuth": cookie.getCookie() }
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

caloricatorControllers.controller("newUserController", function ($scope, $http,cookie) {
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
            url: 'http://localhost:48046/api/newuser',
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
                if (noOfTimesInside <= 1) {
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
                url: 'http://localhost:48046/api/newuser',
                method: "POST",
                data: data2

            }).success(function (data, status, headers, config) {
                cookie.setCookie(data);
                location.href = "#/partials/Welcome.html";
            }).error(function (data, status, headers, config) {

            });
        }
        else {
            alert("Please fix all the open issues before submitting");
        }
    };
});
caloricator.service("radioChosen", function () {
    var radioChosen = "";
    return {
        getRadioChosen: function () { return radioChosen },
        setRadioChosen: function (value) { radioChosen = value; }
    };
});
caloricatorControllers.controller("welcomeController", function ($scope, $http, radioChosen,cookie) {
    $scope.formInfo = {};
    if (user != null) {
        $scope.user = user;
    }
    $http({
        url: "http://localhost:48046/api/Calorie",
        method: "GET",
        headers: { "AppAuth": cookie.getCookie() },
        params: { operation: "GetCaloireCountForToday", todaysDate: (new Date()) }
    }).success(function (data, status, headers, config) {
        $scope.calories = data;
    }).error(function (data, status, headers, config) {
        $scope.calories = "Some Error Occured";
    });
    $scope.Submit = function () {
        if ($scope.formInfo.radio == "Addcalories") {
            location.href = "#/partials/AddCalories.html";
        }
        if ($scope.formInfo.radio == "GetDaysFailedAndPassedInPast1Week") {
            radioChosen.setRadioChosen("GetDaysFailedAndPassedInPast1Week");
            location.href = "#/partials/DisplayCalories.html";
        }
        if ($scope.formInfo.radio == "GetDaysFailedAndPassedCustom") {
            radioChosen.setRadioChosen("GetDaysFailedAndPassedCustom");
            location.href = "#/partials/DisplayCalories.html";
        }
    };
});

caloricatorControllers.controller("addCaloriesController", function ($scope, $http,cookie) {
    $scope.formInfo = {};
    $scope.formInfo.AmountofCalories = 100;
    var currDate = new Date();
    currDate.setSeconds(null, null);
    $scope.formInfo.dateTime = currDate;
    $scope.formInfo.timeZoneOffset = currDate.getTimezoneOffset();
    $scope.Submit = function () {
        $http({
            url: "http://localhost:48046/api/Calorie",
            method: "POST",
            data: JSON.stringify($scope.formInfo),
            headers: { "AppAuth": cookie.getCookie() }
        }).success(function (data, status, headers, config) {
            if (data==true) {
                alert("Data posted successfully");
            }
            else {
                alert("some error occured during insertion");
            }
        }).error(function (data, status, headers, config) {
            alert("Error with value : " + status);
        });
    };
});
caloricatorControllers.controller("displayCaloriesController", function ($scope, $http, radioChosen) {

});
