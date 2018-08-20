angular
.module('appQex')
.controller('personalStrengthsController', ['$scope', 'commonService', 
    function($scope, commonService) {
            var GRAY_LIGHT1 = "#ECECEC";
            var TRANSPARENT = "transparent";

            $scope.exam = {};
            $scope.exam.config = {
                id : "EXA-PS001",
                title: "Exam Strengths",
                description: "Personal Strengths",
                path: "exams/Personality/",
                name: "test.json",
                displayTime: false,
                displayCount: false,
                displayProgressBar: true,
                displayProgressText: true,
                displayExamFinished: true,	
                lockDevTools: false,
                linkedToFiredb: false,
                sarcasticMode: true,                
            };

            $scope.exam.questions = [];
            $scope.exam.rules = [];
            $scope.exam.scale = [];
            $scope.exam.result = [];

            $scope.exam.progressText = "0%";

            $scope.exam.selectedAnswer = null,
            $scope.exam.currentQuestion = 0,
            $scope.exam.isFinished = false;
            
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
            $scope.exam.print = printExam;
    
            function init() {
                $scope.exam.currentQuestion = 0;

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
                    exam.scale = data.scale;
                    exam.rules = data.rules;
            
                    $scope.exam._setQuestion(exam.questions[exam.currentQuestion].question);
                    $scope.exam._setOptions(exam.scale);
                    $scope.exam._setBehaviorButtons();
                });
            }
            
             function _setQuestion(question) {
                $('#questionContainer').empty();
                $('#codeContainer').empty();
                $(document.createElement('h4')).attr('id', 'question').text(question).appendTo('#questionContainer');
             }
            
             function _setOptions(choices) {
                $('#choiceContainer').empty();
                for (var i = 0; i < choices.length; i++) {
                    var pre = $(document.createElement('pre')).text(choices[i].text);
                    var li = $(document.createElement('li'));
                    li.addClass('choice-option')
                    li.attr('data-index', i)
                    li.attr('data-value', choices[i].value)
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
                    $scope.exam.selectedAnswer = $(this).attr('data-value');
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
                $scope.exam._setQuestion(exam.questions[exam.currentQuestion].question);
                $scope.exam._setOptions(exam.scale);
                $scope.exam._setBehaviorButtons();
            }
            
            function _evaluateQuestion(selected) {
                var thisModule = $scope.exam;
                var current = thisModule.currentQuestion;
                
                thisModule.selectedAnswer = null;
                thisModule.questions[current].userAnswer = selected;
            
                thisModule.currentQuestion++;
                
                if(thisModule.config.displayProgressBar) {
                    thisModule._updateProgressBar();
                }
            
                if(current == thisModule.questions.length-1) {
                    thisModule._endExam();
                } 
                else {
                    thisModule._nextQuestion();
                }
            }
            
            function _endExam() {
                var config = $scope.exam.config;            
                var dataUserExam = {}
                dataUserExam.id = config.id;
                dataUserExam.description = config.description;
                dataUserExam.date = new Date();

                $scope.exam.isFinished = true;
                
                if($scope.exam.config.linkedToFiredb) {
                    // var data = $scope.exam.user.getDataUser();
                    // $scope.QEx.firedb.saveResults(data);
                }

                if($scope.exam.config.displayExamFinished) {
                    $scope.exam._showResults();
                }
            }
                        
            function _showResults() {
                var data = [];
                for(var i = 0; i < $scope.exam.rules.length; i++) {
                    var rule = $scope.exam.rules[i];
                    var constraint1 = rule.constraint[0];
                    var constraint2 = rule.constraint[1];
                    var answ1 = $scope.exam.questions.find(i => i.id == "q" + constraint1).userAnswer;
                    var answ2 = $scope.exam.questions.find(i => i.id == "q" + constraint2).userAnswer;
                    var strength = {
                        number: i + 1,
                        displayText: rule.displayText,
                        value: parseInt(answ1) + parseInt(answ2)
                    };
                    data.push(strength);
                }
    
                commonService.sortDefault(data, 'value', 'desc');
                $scope.exam.result = data;
                $scope.$apply();
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
