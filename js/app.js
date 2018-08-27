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
        .state('account', {
            url: '/account',
            templateUrl: 'views/account.html',
            controller: 'accountController'
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

App.controller('AppController', [ '$scope', '$state', '$location', 'firedbService', function ($scope, $state, $location, firedbService) {
    $scope.user = null;
    $scope.userName = null;
    $scope.$on('$locationChangeStart', function(event) {
        $scope.showMenu = ($location.path() != "/login") ? true : false;

        if($location.path() != "/login") {
            firedbService.stateAuth()
            .then(function(dataUser) {
                var user = dataUser;
                if(user != null) {
                    $scope.userName = (user.displayName != null) ? user.displayName : user.email;
                    $scope.$apply();
                    console.log(user.email, user.uid, user.displayName);
                } else {
                    $state.go('login');
                }                
            });
        }
    });

    $scope.signOut = function() {
        firedbService.signOut()
        .then(function() {
            $state.go('login');
        })
        .catch(function(e) {
            console.log(e);
        });
    }

}]);


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

