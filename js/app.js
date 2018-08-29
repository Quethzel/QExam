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
        
        .state('app', {
            url: '/welcome',
            templateUrl: 'views/welcome.html',
        })
        .state('jsFundamentals', {
            url: '/jsFundamentals',
            templateUrl: 'views/jsFundamentals.html',
            controller: 'jsFundamentalsController'
        })
        .state('personalStrengths', {
            url: '/personalStrengths',
            templateUrl: 'views/personalStrengths.html',
            controller: 'personalStrengthsController'
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

App.controller('AppController', [ '$scope', '$rootScope', '$state', '$location', 'firedbService', 'storageService',
function ($scope, $rootScope, $state, $location, firedbService, storageService) {
    $scope.userName = null;
    $scope.displayMenu = false;
    $scope.displayFooter = false;

    $scope.$on('$locationChangeStart', function(event) {
        $scope.displayMenu = ($location.path() != "/login") ? true : false;
        $scope.displayFooter = ($location.path() == "/about") ? true : false;

        if($location.path() != "/login") {
            firedbService.stateAuth()
            .then(function(dataUser) {
                var user = dataUser;
                if(user != null) {
                    $scope.userName = (user.displayName != null) ? user.displayName : user.email;
                    $rootScope.userName = $scope.userName;
                    storageService.set('userName', $scope.userName);
                    $scope.$apply();
                } else {
                    $state.go('login');
                }                
            })
            .catch(function(e) {
                console.log(e);
                $state.go('login');
            });
        }
    });

    $scope.signOut = function() {
        storageService.clear();
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
    console.log("home controller... OK");

}]);

App.controller('aboutCtrl', function($scope) {
    $scope.version = {
        system: "1.2.1",
        database: "4.0.0 firedb",
        date: "07.06.2017 11:53 p.m."
    };
});

