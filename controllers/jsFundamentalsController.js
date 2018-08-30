App.controller('jsFundamentalsController', ['$scope', 'storageService', 'commonService', 'firedbService',
    function($scope, storageService, commonService, firedbService) {
            var GRAY_LIGHT1 = "#ECECEC";
            var TRANSPARENT = "transparent";

            $scope.exam = {};
            $scope.exam.config = {
                id : "EXA-JS001",
                title: "Exam Js",
                description: "Essential Theory & Fundamentals Of JavaScript",
                path: "exams/JavaScript/fundamentals/",
                name: "questions.json",
                displayTime: false,
                displayCount: false,
                displayProgressBar: true,
                displayProgressText: true,
                displayExamFinished: true,	
                lockDevTools: false,
                linkedToFiredb: true,
                sarcasticMode: true,
            };
            
            $scope.exam.snippetName = "snippets.html";
            $scope.snippets = [];
            $scope.exam.questions = [];
            $scope.exam.result = [];

            $scope.exam.progressText = "0%";

            $scope.exam.selectedAnswer = null,
            $scope.exam.currentQuestion = 0,
            $scope.exam.isFinished = false;
            $scope.exam.score = 0;
            
            $scope.exam.init = init;
            $scope.exam.getExam = getExam;
            $scope.exam._setQuestion = _setQuestion;
            $scope.exam._setOptions = _setOptions;
            $scope.exam._setBehaviorButtons = _setBehaviorButtons;
            $scope.exam._evaluateQuestion = _evaluateQuestion;
            $scope.exam._nextQuestion = _nextQuestion;
            $scope.exam._updateProgressBar = _updateProgressBar;
            $scope.exam.lockKeys = lockKeys;
            $scope.exam._endExam = _endExam;
            $scope.exam._showResults = _showResults;
            $scope.exam.showScore = _showScore;
            $scope.exam.print = printExam;
    
            function init() {
                $scope.exam.currentQuestion = 0;
                $scope.exam.score = 0;

                if($scope.exam.config.lockDevTools) {
                    lockKeys();
                }            
                getExam();
            }
            
            function getExam() { 
                var exam = $scope.exam;
                var config = exam.config;
            
                $(document.createElement('button'))
                    .attr('id', 'nextQ').text('Next')
                    .attr('disabled', 'disabled')
                    .addClass('btn btn-lg btn-block').appendTo("#controlContainer");
            
                $.getJSON(config.path + config.name)
                .done(function (data) {
                    exam.questions = data.questions;
            
                    _getSnippets();

                    $scope.exam._setQuestion(exam.questions[exam.currentQuestion].question);
                    $scope.exam._setOptions(exam.questions[exam.currentQuestion].choices);
                    $scope.exam._setBehaviorButtons();
                });
            }

            function _getSnippets() {
                var exam = $scope.exam;
                $.get(exam.config.path + exam.snippetName, function(data) {
                    exam.snippets = $($.parseHTML(data)).filter('pre');
                });
            }
            
             function _setQuestion(question) {
                $('#questionContainer').empty();
                $('#codeContainer').empty();
                $(document.createElement('h4')).attr('id', 'question').text(question).appendTo('#questionContainer');
                
                if($scope.exam.questions[$scope.exam.currentQuestion].haveSnippet) {
                    _setCode($scope.exam.questions[$scope.exam.currentQuestion].id);
                }                
             }

            function _setCode(questionId) {
                $('#codeContainer').append($scope.exam.snippets.filter('pre#' + questionId));
                $('pre code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            }
            
             function _setOptions(choices) {
                $('#choiceContainer').empty();
                for (var i = 0; i < choices.length; i++) {
                    var pre = $(document.createElement('pre')).text(choices[i].answer);
                    var li = $(document.createElement('li'));
                    li.addClass('choice-option')
                    li.attr('data-index', i)
                    li.append(pre);
                    li.appendTo('#choiceContainer');
                };
            }
            
            function _setBehaviorButtons() {
                $('.choice-option').on('mouseover', function() {
                    $(this).css({'background-color': GRAY_LIGHT1});
                });
            
                $('.choice-option').on('mouseout', function() {
                    $(this).css({'background-color': TRANSPARENT});
                });		
            
                $('.choice-option').on('click', function() {
                    $scope.exam.selectedAnswer = $(this).attr('data-index');
                    $('#nextQ').removeAttr('disabled');
                    $('.choice-option').removeAttr('style').off('mouseout mouseover');
                    $(this).css({'border-color':'#222','font-weight':700,'background-color':GRAY_LIGHT1});
                });
            
                $('#nextQ').on('click', function(e) {
                    this.disabled = true;
                    $(this).off('click');
                    $scope.exam._evaluateQuestion($scope.exam.selectedAnswer);
                });
            }
            
            function _nextQuestion() {
                var exam = $scope.exam;
                exam._setQuestion(exam.questions[exam.currentQuestion].question);
                exam._setOptions(exam.questions[exam.currentQuestion].choices);
                exam._setBehaviorButtons();
            }
            
            function _evaluateQuestion(selected) {
                var exam = $scope.exam;
                var current = $scope.exam.currentQuestion;
                
                exam.selectedAnswer = null;
                exam.questions[current].userAnswer = selected;
        
                if(exam.questions[current].choices[selected].correct) {
                    exam.score++;
                }
                exam.currentQuestion++;
                
                if(exam.config.displayProgressBar) {
                    exam._updateProgressBar();
                }
        
                if(current == exam.questions.length-1) {
                    exam._endExam();
                } 
                else {
                    if(exam.displayCount) {
                        exam._updateCounterQuestion();
                    }
                    exam._nextQuestion();
                }
            }
            
            function _endExam() {
                $scope.exam.isFinished = true;
                $scope.exam.score = Math.round($scope.exam.score/$scope.exam.questions.length * 100);
                $scope.exam.showScore();

                if($scope.exam.config.linkedToFiredb) {
                    var dataExam = new userExamResult();
                    dataExam.date = new Date();
                    dataExam.id = $scope.exam.config.id;
                    dataExam.description = $scope.exam.config.description;
                    dataExam.name = localStorage.getItem('userName');
                    dataExam.score = $scope.exam.score;
                    
                    firedbService.saveExamResults(dataExam);
                }

                if($scope.exam.config.displayExamFinished) {
                    $scope.exam._showResults();
                }
            }
                        
            function _showResults() {
                var data = [];

                for(var i = 0; i < $scope.exam.questions.length; i++) {

                    var question = $scope.exam.questions[i].question;
                    var choices = $scope.exam.questions[i].choices;
                    var userAnswer = choices[$scope.exam.questions[i].userAnswer];
                    var correctAnswer = choices.filter(function(answer) {
                        return answer.correct == true;
                    })[0];

                    var row = {
                        question: question,
                        userAnswer: userAnswer,
                        correctAnswer: correctAnswer
                    }
                    data.push(row);
                }

                $scope.exam.result = data;
                $scope.$apply();
            }

            function _showScore() {
                $(document.createElement('h4'))
                .text("Your Score " + $scope.exam.score + "%")
                .addClass('score')
                .appendTo('#questionContainer');                
            }
            
            function _updateProgressBar() {
                var exam = $scope.exam;
                var val = Math.floor((exam.currentQuestion * 100) / exam.questions.length) + '%';
                $('.progress-bar').width(val);
                $scope.exam.progressText = val;
                $scope.$apply();
            }
            
            function lockKeys() {
                commonService.lockKeys();
            }

            function printExam() {
                commonService.print('tableResults', 'html');
            }

            $scope.exam.init();

    }
]);
