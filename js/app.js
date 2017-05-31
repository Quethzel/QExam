var App = angular.module('appQex', [
    'ngRoute',
    'ui.router',
    'ngSanitize'
]);

App.config(function($stateProvider, $urlRouterProvider, $routeProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('exam', {
            url: '/exam',
            templateUrl: 'views/exam.html',
            controller: 'examCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html',
            controller: 'aboutCtrl'
        })
        .state('results', {
            url: '/results',
            templateUrl: 'views/results.html',
            controller: 'resultsCtrl'
        })

    $urlRouterProvider.otherwise('/login');

});


App.controller('AppController', function ($scope, $rootScope, $routeParams, $location, $state) {
    $scope.$on('$locationChangeStart', function(event) {
        $scope.showMenu = ($location.path() != "/exam") ? true : false;
    });
    
    /* initializes firedb */
    if(QEx.ExamModule.linkedToFiredb) {
        QEx.firedb.init();
    }
});


App.controller('loginCtrl', function($scope, $state) {
    $scope.user = {
        username: null
    };

    $('#user').keyup(function(e) {
        if(e.keyCode == 13)
            $scope.starExam();
    });
    
    $scope.starExam = function() {
        $scope.submitted = true;
        if($scope.loginForm.$invalid) {
            return false;
        }

        QEx.user.setProfile({ name: $scope.user.username });
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
        system: "1.1.2",
        database: "4.0.0 firedb",
        date: "30.05.2017 11:27 p.m."
    };
});
