angular.module('appQex').service('commonService', [
    function() {

        var service = {
            print: _print,
            lockKeys: _lockKeys,
            sortDefault: _sortDefault
        };

        return service;

        /**
         * Sort an array by string property order by default asc
         * @param {Array} data 
         * @param {string} property 
         * @param {string} order 
         */
        function _sortDefault(data, property, order) {
            try {
                if(!Array.isArray(data)) {
                    throw new Error('Data param must be an array');
                }

                (order == 'desc')
                    ? data.sort(function(a,b) { return b[property] - a[property]; })
                    : data.sort(function(a,b) { return a[property] - b[property]; });
                
                return data;
            } 
            catch (e) {
                console.log('Error: ' + e);
            }
        }

        function _print(id, format) {
            format = format || 'html';
            printJS(id, format);
        }

        /**
         * Lock rigth click and F12, Ctrl + Shift + I Keys
         */
        function _lockKeys() {
            $(document).keydown(function(event) {
                if(event.keyCode == 123) {
                    console.log('Las herramientas de desarrollador no son requeridas en este examen');
                    return false;
                }
                else if (event.ctrlKey && event.shiftKey && event.keyCode==73) {
                    console.log('algunas teclas estan bloqueadas');
                    return false;
                }
            });
            
            $(document).on("contextmenu",function(e) {
                e.preventDefault();
                console.log("El menú contextual no es requerido en esta página!");
            });			
        }        

    }
]);