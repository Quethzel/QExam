/* QExam namespace */
var QExam = {};
	
var GRAY_LIGHT1 = "#ECECEC";
var TRANSPARENT = "transparent";


/* 
	exam namespace
*/
QExam.ExamModule = {
	// config
	id : "EXA-JS001",
	title: "Exam Js",
	description: "Essential Theory & Fundamentals Of JavaScript",
	path: "exams/JavaScript/fundamentals/",
	name: "questions.json",
	questions: [],
	snippetName: "snippets.html",
	snippets: [],
	displayTime: false,
	displayCount: true,
	displayExamFinished: true,
	selectedAnswer: null,
	lockDevTools: false,
	currentQuestion: 0,
	score: 0,

	//methods
	init: function() {
		$('#examTitle').text(this.title);
		$('#examInfo').text(this.id + ' | ' + this.description);
		
		if(this.displayCount) {
			$('#counterQuestion').text(' | Question ' + this.currentQuestion + ' To ' + this.questions.length);
		}
		if(this.lockDevTools) {
			this.lockKeys();
		}
		
		this.getSnippets(function() {
			//console.log(this.data);
		});

		this.getExam();
	},

	getExam: function() {
		var exam = this;

		$(document.createElement('button'))
			.attr('id', 'nextQ').text('Siguiente')
			.attr('disabled', 'disabled')
			.addClass('btn btn-lg btn-block').appendTo("#controlContainer");

		$.getJSON(this.path + this.name).done(function (data) {
			exam.questions = data;

			exam._setQuestion(exam.questions[exam.currentQuestion].question);
			exam._setOptions(exam.questions[exam.currentQuestion].choices);
			exam._setBehaviorButtons();
		});
	},
	getSnippets: function(callback) {
		var dataSnippets = this.snippets;
		$.get(this.path + this.snippetName, function(data) {
			dataSnippets.data = $($.parseHTML(data)).filter('pre');
			if(callback) {
				callback.apply(dataSnippets);
			}
		});
	},

	_setQuestion: function(question) {
		$('#questionContainer').empty();
		$(document.createElement('h4')).attr('id', 'question').text(question).appendTo('#questionContainer');
		if(this.questions[this.currentQuestion].haveSnippet) {
			this._setCode(this.questions[currentQuestion].id);
		}
	},

	_setCode: function(questionId) {
		$('#codeContainer').empty();
		$('#codeContainer').append(this.snippets.filter('#pre' + questionId));
		$('pre code').each(function (i, block) {
			hljs.highlightBlock(block);
		});
	},

	_setOptions: function(choices) {
		$('#choiceContainer').empty();
		for (var i = 0; i < choices.length; i++) {
			var pre = $(document.createElement('pre')).text(choices[i].answer);
			var li = $(document.createElement('li'));
			li.addClass('choice-option')
			li.attr('data-index', i)
			li.append(pre);
			li.appendTo('#choiceContainer');
		};
	},

	_setBehaviorButtons: function() {
		$('.choice-option').on('mouseover', function() {
			$(this).css({'background-color': GRAY_LIGHT1});
		});

		$('.choice-option').on('mouseout', function() {
			$(this).css({'background-color': TRANSPARENT});
		});		

		$('.choice-option').on('click', function() {
			QExam.ExamModule.selectedAnswer = $(this).attr('data-index');
			$('#nextQ').removeAttr('disabled');
			$('.choice-option').removeAttr('style').off('mouseout mouseover');
			$(this).css({'border-color':'#222','font-weight':700,'background-color':GRAY_LIGHT1});

		});

		$('#nextQ').on('click', function(e) {
			var thisModule = QExam.ExamModule;
			this.disabled = true;
			$(this).off('click');
			thisModule._evaluateQuestion(thisModule.selectedAnswer);
		});
	},

	_evaluateQuestion: function(selected) {
		var thisModule = QExam.ExamModule;
		var current = thisModule.currentQuestion;
		
		thisModule.selectedAnswer = null;
		thisModule.questions[current].userAnswer = selected;

		if(thisModule.questions[current].choices[selected].correct) {
			thisModule.score ++;
		}
		if(current == thisModule.questions.length-1) {
			thisModule._endExam();
		} 
		else {
			thisModule.currentQuestion++;
			if(thisModule.displayCount) {
				thisModule._updateCounterQuestion();
			}
			thisModule._nextQuestion();
		}
	},

	_nextQuestion: function() {
		this._setQuestion(this.questions[this.currentQuestion].question);
		this._setOptions(this.questions[this.currentQuestion].choices);
		this._setBehaviorButtons();
	},

	_endExam: function() {
		$('#questionContainer').empty();
		$('#codeContainer').empty();
		$('#choiceContainer').empty();
		$('#controlContainer').empty();
		this._showScore();

		if(this.displayExamFinished) {
			this._showResults();
		}
		
		$(document.createElement('button'))
			.attr('id', 'finishExam').text('Finalizar Examen')
			.addClass('btn btn-md btn-default btn-center')
			.css({'display': 'block'})
			.appendTo('#extraContainer');

			$('#finishExam').on('click', function() {
				location.reload();
			});
	},

	_showScore: function() {
		$(document.createElement('h4'))
			.text("Puntuación " + this.score + " sobre " + this.questions.length)
			.addClass('score')
			.appendTo('#questionContainer');

		$(document.createElement('h4'))
			.text(Math.round(this.score/this.questions.length * 100) + '%')
			.addClass('score')
			.insertAfter('#questionContainer');
	},

	_showResults: function() {
		$(document.createElement('div')).attr('id', 'result-exam').addClass('list-group').appendTo('#resultContainer');

		for (var i = 0; i < this.questions.length; i++) {
			
			var correctAnswers = this.questions[i].choices.filter(function (answer) { 
				return answer.correct == true; 
			});

			var incorrectAnswers = this.questions[i].choices.filter(function (answer) {
				return answer.correct == false;
			});

			$(document.createElement('a'))
				.addClass('list-group-item list-group-item-info')
				.text('Q: ' + this.questions[i].question).appendTo('#result-exam');

			if(!this.questions[i].choices[this.questions[i].userAnswer].correct) {
				$(document.createElement('a'))
					.addClass('list-group-item list-group-item-danger')
					.text('A: ' + this.questions[i].choices[this.questions[i].userAnswer].answer).appendTo('#result-exam');
			}

			for (var j = 0; j < correctAnswers.length; j++) {
				$(document.createElement('a'))
					.addClass('list-group-item list-group-item-success')
					.text('C: ' + correctAnswers[j].answer).appendTo('#result-exam');
			};
		};
	},

	_updateCounterQuestion: function() {

	},

	// lock right click and keys F12, Ctrl + Shift + I
	lockKeys: function() {
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
};


/*
 * firebase namespace
*/
QExam.firedb = {};





/* implementation */

$(document).ready(function() {
	QExam.ExamModule.init();
});

