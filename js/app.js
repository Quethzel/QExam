var App = angular.module('appQex', [
    'ngRoute',
    'ui.router'
    //'ngSanitize'
]);

App.config(function($stateProvider, $urlRouterProvider, $routeProvider) {
    $stateProvider
        .state('login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('exam', {
            templateUrl: 'views/exam.html',
            controller: 'examCtrl'
        })
        .state('about', {
            templateUrl: 'views/about.html',
            controller: 'aboutCtrl'
        })
        .state('results', {
            templateUrl: 'views/results.html',
            controller: 'resultsCtrl'
        })

    $urlRouterProvider.otherwise('/login');
});


App.controller('AppController', function ($scope, $rootScope, $routeParams, $location, $state) {
    /* initializes firedb */
    if(QEx.ExamModule.linkedToFiredb) {
        QEx.firedb.init();
    }
    $state.go('login');

});


App.controller('loginCtrl', function($scope, $state) {
    $('#user').keyup(function(e) {
        if(e.keyCode == 13)
            $scope.starExam();
    });
    
    $scope.starExam = function() {
        QEx.user.setProfile({ name: $("#user").val() });
        $state.go('exam');
    };
});


App.controller('examCtrl', function($scope, $state) {
    /* implementarion of QEx */
    QEx.ExamModule.init();
});


App.controller('resultsCtrl', function($scope, $state) {
    QEx.firedb.getAllResults(); 
});

App.controller('aboutCtrl', function($scope, $state) {
    $scope.version = {
        system: "1.0.0",
        database: "4.0.0 firedb",
        date: "28.05.2017 6:33 a.m."
    };
});
