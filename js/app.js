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
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .state('personalStrengths', {
            url: '/personalStrengths',
            templateUrl: 'views/personalStrengths.html',
            controller: 'personalStrengthsController'
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

    $urlRouterProvider.otherwise('/home');

});

App.run(function($state, $rootScope){
   $rootScope.$state = $state;
});

App.controller('AppController', function ($scope, $rootScope, $routeParams, $location, $state) {
    $scope.$on('$locationChangeStart', function(event) {
        $scope.showMenu = ($location.path() != "/exam") ? true : false;
    });
});

App.controller('homeController', function($scope, $state) {
    console.log("home");
});

App.controller('aboutCtrl', function($scope, $state) {    
    $scope.version = {
        system: "1.2.1",
        database: "4.0.0 firedb",
        date: "07.06.2017 11:53 p.m."
    };
});
