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
//custom directive
//caloricator.directive('ngTabActivate', function () {
//    return {
//        restrict: "A",
//        link: function (scope, elem, attrs) {
//            elem.bind('click', function () {
//                setClass(attrs.id);
//            });
//        }
//    };
//});
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

caloricator.service("cookie", function () {
    return {
        getCookie: function () { return localStorage.getItem("AppAuth") },
        setCookie: function (value) { localStorage.setItem("AppAuth", value) }
    };
});
caloricatorControllers.controller("homeController", function ($scope, $http, cookie) {
    if (cookie.getCookie() === null || cookie.getCookie() === undefined || cookie.getCookie() == "") {
        setTimeout(function () {
            location.href = "#/partials/NewOrExisting.html";
        }, 1000);
    }
    else {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/user',
            method: "GET",
            headers: { "AppAuth": cookie.getCookie() }
        }).success(function (data, status, headers, config) {
            setTimeout(function () {
                user = data;
                location.href = "#/partials/Welcome.html";
            }, 1000);

        }).error(function (data, status, headers, config) {
            $scope.errorMessage = status;
        });
    }
});
caloricatorControllers.controller("newOrExistingUserController", function ($scope, $http,cookie) {
    $scope.active = "";
    $scope.formInfo = {};
    $scope.navigateToNewUser = function () {
        location.href = "#/partials/NewUser.html";
    }
    $scope.login = function () {
        $http({
            url: 'http://caloricator.azurewebsites.net/api/user',
            method: "POST",
            data: JSON.stringify($scope.formInfo)
        }).success(function (data, status, headers, config) {
            cookie.setCookie(data);
            $http({
                url: 'http://caloricator.azurewebsites.net/api/user',
                method: "GET",
                headers: { "AppAuth": cookie.getCookie() }
            }).success(function (data, status, headers, config) {
                setTimeout(function () {
                    user = data;
                    location.href = "#/partials/Welcome.html";
                }, 1000);

            }).error(function (data, status, headers, config) {
                $scope.errorMessage = status;
            });
            location.href = "#/partials/Welcome.html";
        }).error(function (data, status, headers, config) {
            alert("The data enter doesnt match any existing users");
        });
    };
});

caloricatorControllers.controller("newUserController", function ($scope, $http, cookie) {
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
                url: 'http://caloricator.azurewebsites.net/api/newuser',
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
caloricator.service("radioRelatedData", function () {
    var radioRelatedData = {};
    return {
        getRadioChosen: function () { return radioRelatedData },
        setRadioChosen: function (value, startDate, endDate) { radioRelatedData = { radioChosen: value, startDate: startDate, endDate: endDate }; }
    };
});
caloricatorControllers.controller("welcomeController", function ($scope, $http, radioRelatedData, cookie) {
    $scope.a1class = "active";
    $scope.a2class = "";
    $scope.setClass = function (evt) {
        var id = evt.currentTarget.id;
        if (id == "a1") {
            $scope.a1class = "active";
            $scope.a2class = "";
        }
        if (id == "a2") {
            $scope.a2class = "active";
            $scope.a1class = "";
        }
    };
    $scope.logOut = function () {
        var result = confirm("Are you sure you want to log out ?");
        if (result) {
            cookie.setCookie("");
            location.href = "#/partials/NewOrExisting.html";
        }
    };
    $scope.exitApp = function () {
        var result = confirm("Are you sure you want to exit the app ?");
        if (result) {
            navigator.app.exitApp();
        }
    };
    $scope.showDatePicker = false;
    $scope.formInfo = {};
    if (user != null) {
        $scope.user = user;
    }
    $scope.btnClassObject = {
        btn: true,
        btnDanger: true,
        btnPrimary: false
    };
    $scope.buttonText = "Add Calories";
    $http({
        url: "http://caloricator.azurewebsites.net/api/Calorie",
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
            var d = new Date();
            d.setDate(d.getDate() - 5);
            radioRelatedData.setRadioChosen("GetDaysFailedAndPassedInPast1Week", d.toDateString(), new Date().toDateString());
            location.href = "#/partials/DisplayCalories.html";
        }
        if ($scope.formInfo.radio == "GetDaysFailedAndPassedCustom") {
            radioRelatedData.setRadioChosen("GetDaysFailedAndPassedCustom");
            $scope.formInfo.fromDate.setMinutes($scope.formInfo.fromDate.getMinutes() - $scope.formInfo.fromDate.getTimezoneOffset());
            $scope.formInfo.toDate.setMinutes($scope.formInfo.toDate.getMinutes() - $scope.formInfo.toDate.getTimezoneOffset());
            radioRelatedData.setRadioChosen("GetDaysFailedAndPassedCustom", $scope.formInfo.fromDate.toDateString(), $scope.formInfo.toDate.toDateString());
            location.href = "#/partials/DisplayCalories.html";
        }
    };
    $scope.CheckForOption = function () {
        if ($scope.formInfo.radio == "GetDaysFailedAndPassedCustom") {
            $scope.showDatePicker = true;
            $scope.btnClassObject.btnPrimary = true;
            $scope.btnClassObject.btnDanger = false;
            $scope.buttonText = "Get Data";
        }
        if ($scope.formInfo.radio == "GetDaysFailedAndPassedInPast1Week") {
            $scope.showDatePicker = false;
            $scope.btnClassObject.btnPrimary = true;
            $scope.btnClassObject.btnDanger = false;
            $scope.buttonText = "Get Data";
        }
        if ($scope.formInfo.radio == "Addcalories") {
            $scope.showDatePicker = false;
            $scope.btnClassObject.btnPrimary = false;
            $scope.btnClassObject.btnDanger = true;
            $scope.buttonText = "Add Calories";
        }
    };
    //Important lession learnt. Dont write DOM manipulations in the controller. Write a custom anjular directive

});

caloricatorControllers.controller("addCaloriesController", function ($scope, $http, cookie) {
    $scope.isShowSuccess = false;
    $scope.isShowFailure = false;
    $scope.formInfo = {};
    $scope.formInfo.AmountofCalories = 100;
    var currDate = new Date();
    currDate.setSeconds(null, null);
    $scope.formInfo.dateTime = currDate;
    $scope.formInfo.timeZoneOffset = currDate.getTimezoneOffset();
    $scope.Submit = function () {
        $http({
            url: "http://caloricator.azurewebsites.net/api/Calorie",
            method: "POST",
            data: JSON.stringify($scope.formInfo),
            headers: { "AppAuth": cookie.getCookie() }
        }).success(function (data, status, headers, config) {
            $scope.isShowSuccess = true;
        }).error(function (data, status, headers, config) {
            $scope.isShowFailure = true;
            $scope.statusCode = status;
        });
    };
});
caloricatorControllers.controller("displayCaloriesController", function ($scope, $http, radioRelatedData, cookie) {
    $scope.dataTableOfCalories = "";
    $http({
        url: "http://caloricator.azurewebsites.net/api/Calorie",
        method: "GET",
        headers: { "AppAuth": cookie.getCookie() },
        params: { operation: radioRelatedData.getRadioChosen().radioChosen, startDate: radioRelatedData.getRadioChosen().startDate, endDate: radioRelatedData.getRadioChosen().endDate }
    }).success(function (data, status, headers, config) {
        //Complicated logic.. Even I dont understand what I wrote.. but i works.. so.. Enjoy maintaining it
        $scope.dataTableOfCalories = data;
        var sumOfCalEachDay = [];
        sumOfCalEachDay.push({ datePart: $scope.dataTableOfCalories[0].TS, sum: $scope.dataTableOfCalories[0].Calories, times: [], id: 0 });
        for (var i = 0; i < $scope.dataTableOfCalories.length; i++) {
            var dateFromJSON = $scope.dataTableOfCalories[i].TS;
            for (var j = 0; j < sumOfCalEachDay.length; j++) {
                if (CompareDates(dateFromJSON, sumOfCalEachDay[j].datePart) == "equal") {
                    if (i != 0) {
                        sumOfCalEachDay[j].sum += $scope.dataTableOfCalories[i].Calories;
                    }
                    //var time = ExtractTime(dateFromJSON);
                    sumOfCalEachDay[j].times.push({ time: dateFromJSON, comments: $scope.dataTableOfCalories[i].Comments, calories: $scope.dataTableOfCalories[i].Calories });
                    break;
                }
                if (j + 1 == sumOfCalEachDay.length) {
                    if (i != 0) {
                        sumOfCalEachDay.push({ datePart: dateFromJSON, sum: $scope.dataTableOfCalories[i].Calories, times: [], id: sumOfCalEachDay.length });
                        //var time = ExtractTime(dateFromJSON);
                        sumOfCalEachDay[j + 1].times.push({ time: dateFromJSON, comments: $scope.dataTableOfCalories[i].Comments, calories: $scope.dataTableOfCalories[i].Calories });
                        break;
                    }
                }
            }
        }
        $scope.sumOfCalEachDay = CovertDateIntoReadableFormat(sumOfCalEachDay);
        $scope.timesArray = [];
        var ctr = 0;
        $scope.setID = function () {
            return ctr++;
        }
        $scope.SetTimesArray = function (id) {
            $scope.timesArray = sumOfCalEachDay[id].times;
            $scope.dateOfConsumption = sumOfCalEachDay[id].datePart;
        };
    }).error(function (data, status, headers, config) {
        $scope.sumOfCalEachDay = "ERRORs";
    });
});
function CompareDates(date1, date2) {
    var dayOfDate1 = date1.substring(8, 10);
    var dayOfDate2 = date2.substring(8, 10);
    var monthOfDate1 = date1.substring(5, 7);
    var monthOfDate2 = date2.substring(5, 7);
    var yearOfDate1 = date1.substring(0, 4);
    var yearOfdate2 = date2.substring(0, 4);
    if (yearOfDate1 < yearOfDate1) { return "past" }
    else if (yearOfDate1 > yearOfdate2) { return "future" }
    else {
        if (monthOfDate1 < monthOfDate2) { return "past" }
        else if (monthOfDate1 > monthOfDate2) { return "future" }
        else {
            if (dayOfDate1 < dayOfDate2) { return "past" }
            else if (dayOfDate1 > dayOfDate2) { return "future" }
            else { return "equal" }
        }
    }
}
function CovertDateIntoReadableFormat(arrayOfDates) {
    for (var i = 0; i < arrayOfDates.length; i++) {
        var currObj = arrayOfDates[i];
        var unReadableDate = currObj.datePart;
        var furtherUnreadableDate = unReadableDate.concat(".000Z");
        var newDate = new Date(furtherUnreadableDate);
        var timeZoneOffset = (new Date()).getTimezoneOffset();
        newDate.setSeconds(newDate.getSeconds() + timeZoneOffset * 60);
        for (var j = 0; j < currObj.times.length; j++) {
            var timeDate = new Date(currObj.times[j].time);
            timeDate.setSeconds(timeDate.getSeconds() + timeZoneOffset * 60);
            currObj.times[j].time = formatAMPM(timeDate);
        }
        currObj.datePart = newDate.toDateString();
    }
    return arrayOfDates;
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
