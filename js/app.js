var App = angular.module('appQex', [
    'ngRoute',
    'ui.router',
    'ngSanitize',
    'ui.bootstrap'
]);

App.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })
        .state('app', {
            url: '/welcome',
            templateUrl: 'views/welcome.html',
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

App.service('authService', function($q) {
    return {
        isAuth: function(){
            return true;
        }
    }
});

App.run(function($rootScope, $transitions, authService) {
    $transitions.onBefore({}, function(transition) {
        if (!authService.isAuth() && transition.to().name != 'login') {
          return transition.router.stateService.target('login');
        }
    });
});

App.controller('AppController', function ($scope, $rootScope, $routeParams, $location, $state) {    
    $scope.$on('$locationChangeStart', function(event) {
        $scope.showMenu = ($location.path() != "/login") ? true : false;
    });
});


App.controller('homeController', ['$scope', '$state', '$uibModal', 'commonService', function($scope, $state, $uibModal, commonService) {
    console.log("home");

}]);

App.controller('aboutCtrl', function($scope) {

    $scope.version = {
        system: "1.2.1",
        database: "4.0.0 firedb",
        date: "07.06.2017 11:53 p.m."
    };
});

