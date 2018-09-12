App.controller('accountController', ['$scope', '$state','firedbService', 'fireStoreService',
function($scope, $state, firedbService, fireStoreService) {

    $scope.account = {};


    $scope.init = init;

    $scope.init();

    function init() {

    }
    

}]);