App.service('storageService', [
    function() {

        var service = {
            set: _set,
            get: _get,
            clear: _clear
        };

        return service;

        // private methods

        function _set(key, val) {
            window.localStorage.setItem(key, val);
        }

        function _get(key) {
            window.localStorage.getItem(key);
        }

        function _clear() {
            window.localStorage.clear();
        }


    }
])