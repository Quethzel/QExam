/* QExam namespace */
var QExam = {};


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
	displayAnswer: true,
	selectedAnswer: null,
	lockDevTools: true,
	currentQuestion: 0,

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
		//load snippets and code
		this.getSnippets(function() {
			//console.log(this.data);
		});

		this.getExam();
	},

	getExam: function() {
		var exam = this;
		$.getJSON(this.path + this.name).done(function (data) {
			exam.questions = data;

			exam._setQuestion(exam.questions[exam.currentQuestion].question);
			exam._setOptions(exam.questions[exam.currentQuestion].choices);

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
		$(document.createElement('h4'))
			.attr('id', 'question')
			.text(question).appendTo('#containerQuestions');
	},

	_setCode: function() {

	},

	_setOptions: function(choices) {
		$('#containerChoices').empty();
		for (var i = 0; i < choices.length; i++) {
			var pre = $(document.createElement('pre')).text(choices[i].answer);
			var li = $(document.createElement('li'));
			li.addClass('choice-option')
			li.attr('data-index', i)
			li.append(pre);
			li.appendTo('#containerChoices');
		};
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

