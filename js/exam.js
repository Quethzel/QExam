/** QEx Namespace */
var QEx = {};
	
var GRAY_LIGHT1 = "#ECECEC";
var TRANSPARENT = "transparent";


/* *
	Exam Namespace
*/
QEx.ExamModule = {
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
	f12wasPressed: false,
	currentQuestion: 0,
	score: 0,
	linkedToFiredb: true,

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
		if(this.linkedToFiredb) {
			QEx.firedb.init();
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
			QEx.ExamModule.selectedAnswer = $(this).attr('data-index');
			$('#nextQ').removeAttr('disabled');
			$('.choice-option').removeAttr('style').off('mouseout mouseover');
			$(this).css({'border-color':'#222','font-weight':700,'background-color':GRAY_LIGHT1});

		});

		$('#nextQ').on('click', function(e) {
			var thisModule = QEx.ExamModule;
			this.disabled = true;
			$(this).off('click');
			thisModule._evaluateQuestion(thisModule.selectedAnswer);
		});
	},

	_evaluateQuestion: function(selected) {
		var thisModule = QEx.ExamModule;
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
		
		this.score = Math.round(this.score/this.questions.length * 100);
		this._showScore();
		
		QEx.user.setExam(this);

		if(this.displayExamFinished) {
			this._showResults();
		}

		if(this.linkedToFiredb) {
			var data = QEx.user.getDataUser();
			QEx.firedb.saveResults(data);
		}
		
		$(document.createElement('button'))
			.attr('id', 'finishExam').text('Finalizar Examen')
			.addClass('btn btn-md btn-default btn-center')
			.css({'display': 'block'})
			.appendTo('#extraContainer');

			$('#finishExam').on('click', function() {
				window.location.replace('index.html');
			});
	},

	_showScore: function() {
		$(document.createElement('h4'))
			.text("Puntuación " + this.score + "%")
			.addClass('score')
			.appendTo('#questionContainer');
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
					.text('UA: ' + this.questions[i].choices[this.questions[i].userAnswer].answer).appendTo('#result-exam');
			}

			for (var j = 0; j < correctAnswers.length; j++) {
				$(document.createElement('a'))
					.addClass('list-group-item list-group-item-success')
					.text('CA: ' + correctAnswers[j].answer).appendTo('#result-exam');
			};
		};
	},

	_updateCounterQuestion: function() {

	},

	lockKeys: function() {
		// lock right click and keys F12, Ctrl + Shift + I
		$(document).keydown(function(event) {
		    if(event.keyCode == 123) {
		    	this.f12wasPressed = true;
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


/**
 * Firebase Namespace
*/
QEx.firedb = {
	config: {
	    apiKey: "AIzaSyBQuNtJb8_2B73__lyeV4iLcPnz0U5w6Cg",
	    authDomain: "jsexam-b9436.firebaseapp.com",
	    databaseURL: "https://jsexam-b9436.firebaseio.com",
	    projectId: "jsexam-b9436",
	    storageBucket: "jsexam-b9436.appspot.com",
	    messagingSenderId: "94780519527"		
	},
	ref: null,

	init: function() {
		firebase.initializeApp(this.config);
		this.ref = firebase.database().ref('exam');
	},
	saveResults: function(data) {
		this.ref.push(data);
		console.log("data saved!");
	},
	getAllResults: function() {
		$('#row-results').empty();

		var users = [
			{'user': 'Jhon Doe', 'exam': 'EXA-JS001', 'score': '100%'},
			{'user': 'Wendy Clapton', 'exam': 'EXA-JS001', 'score': '96%'},
			{'user': 'Jane Doe', 'exam': 'EXA-JS001', 'score': '88%'},
			{'user': 'Eli Page', 'exam': 'EXA-JS001', 'score': '96%'},
			{'user': 'Susy Mackenly', 'exam': 'EXA-JS001', 'score': '86%'},
			{'user': 'Jhon Jones', 'exam': 'EXA-JS001', 'score': '83%'}
		];

		for (var i = 0; i < users.length; i++) {
			var tr = $(document.createElement('tr')).attr('id', 'row' + i);
			var user = users[i].user;
			var exam = users[i].exam;
			var score = users[i].score;

			$(document.createElement('td')).attr('data-title', 'User').text(user).appendTo(tr);
			$(document.createElement('td')).attr('data-title', 'Exam').text(exam).appendTo(tr);
			$(document.createElement('td')).attr('data-title', 'Score').text(score).appendTo(tr);
			tr.appendTo('#row-results');
		};

		/* var users = data.val();
		var keys = Object.keys(users);
		var tr = $(document.createElement('tr'));
		
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i];
			var name = users[k].name;
			var exam = users[k].exam;
			var score = users[k].score;
			$(document.createElement('td')).attr('data-title', name).text(name).appendTo(tr);
		};
		tr.appendTo('#row-results');
		*/
	}
};


/**
 * User Namescpace
 */
QEx.user = {
	profile: {
		name: null
	},
	exam: {
		id: null,
		description: null,
		score: 0
	},

	setProfile: function(data) {
		this.profile.name = data.name;
	},
	setExam: function(data) {
		this.exam.id = data.id;
		this.exam.description = data.description;
		this.exam.score = data.score;
	},
	getDataUser: function() {
		return $.extend({}, this.profile, this.exam);
	}
};
