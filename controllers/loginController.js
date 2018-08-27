App.controller('loginController', ['$scope', '$state', '$timeout', 'firedbService', 
function($scope, $state, $timeout, firedbService ) {

    $scope.typeAuth = {
        "email": 1,
        "google": 2,
        "facebook": 3
    };

    $scope.dataText = {
        signIn: "Sign In",
        register: "Register"
    };

    $scope.error = {
        code: null,
        message: null
    };

    $scope.isReg = false;

    $scope.loginBtnText = $scope.dataText.signIn;
      
    $scope.login = {
        username: null,
        password: null,
        typeAuth: $scope.typeAuth.email
    };

    $scope.login.setCreateAccount = _setCreateAccount;
    $scope.login.backToMain = _backToMain;
    $scope.login.signIn = _signIn;


    // private methods

    function _setCreateAccount() {
        $scope.loginBtnText = $scope.dataText.register;
        $scope.isReg = true;
    }

    function _backToMain() {
        $scope.loginBtnText = $scope.dataText.signIn;
        $scope.isReg = false;
        $scope.error.code = null;
    }

    function _signIn() {
        //register
        if($scope.isReg) {
            firedbService.regByEmail($scope.login.username, $scope.login.password)
            .then(function() {
                console.log('welcome to QEx ', $scope.login.username);
                $state.transitionTo('home');
            })
            .catch(function(e) {
                _setError(e.code, e.message);
            });
        } 
        //login
        else {
            firedbService.setPersistence()
            .then(function() {
                firedbService.signInByEmail($scope.login.username, $scope.login.password)
                .then(function() {
                    $state.transitionTo('home');
                })
                .catch(function(e) {
                    _setError(e.code, e.message);
                });
            })
            .catch(function(e) {
                _setError(e.code, e.message);
            });
        }
    }

    function _setError(code, message) {
        $scope.error.code = code;
        $scope.error.message = message;
        console.log($scope.error);
    }

}]);