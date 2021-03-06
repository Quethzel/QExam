/**
 * Firebase Namespace
 */

App.service('firedbService', [
     function() {
        var firedb = {};

        firedb._config = {
                apiKey: "AIzaSyBQuNtJb8_2B73__lyeV4iLcPnz0U5w6Cg",
                authDomain: "jsexam-b9436.firebaseapp.com",
                databaseURL: "https://jsexam-b9436.firebaseio.com",
                projectId: "jsexam-b9436",
                storageBucket: "jsexam-b9436.appspot.com",
                messagingSenderId: "94780519527"
            
        };
        firedb.ref = null;
        firedb.init = _init(this._config);
        
        // auth
        firedb.regByEmail = _regByEmail;
        firedb.signInByEmail = _signInByEmail;
        firedb.signOut = _signOut;
        firedb.currentUser = _currentUser;
        firedb.setPersistence = _setPersistence;
        firedb.stateAuth = _stateAuth;

        // exam
        firedb.saveExamResults = _saveExamResults;
        
        return firedb;


        // private methods
        function _init() {
            firebase.initializeApp(firedb._config);
            firedb.ref = firebase.database().ref('exam');
            console.log('firebase db connection... OK!');
        }

        /* Auth */
        function _setPersistence() {
            return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        }

        function _regByEmail(email, pass) {
            return firebase.auth().createUserWithEmailAndPassword(email, pass);
        }

        function _signInByEmail(email, pass) {
            return firebase.auth().signInWithEmailAndPassword(email, pass);
        }

        function _signOut() {
            return firebase.auth().signOut();
        }

        function _currentUser() {
            return firebase.auth().currentUser;
        }

        function _stateAuth() {
            return new Promise(function(resolve, reject) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if(user) {
                        resolve(user);
                    } else {
                        reject(new Error('expired session...'));
                    }
                });
            });
        }

        /* exam */
        function _saveExamResults(data) {
            firedb.ref.push(data);
            console.log('data saved!')
        }


     }
 ]);