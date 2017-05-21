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

		$(document.createElement('button'))
			.attr('id', 'nextQ').text('Siguiente')
			.attr('disabled', 'disabled')
			.addClass('btn btn-lg btn-block').appendTo("#containerControls");

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

	_setBehaviorButtons: function() {
		$('.choice-option').on('mouseover', function() {
			$(this).css({'background-color': GRAY_LIGHT1});
		});

		$('.choice-option').on('mouseout', function() {
			$(this).css({'background-color': TRANSPARENT});
		});		

		$('.choice-option').on('click', function() {
			this.selectedAnswer = $(this).attr('data-index');
			$('#nextQ').removeAttr('disabled');
			$('.choice-option').removeAttr('style').off('mouseout mouseover');
			$(this).css({'border-color':'#222','font-weight':700,'background-color':'#c1c1c1'});

		});

		$('#nextQ').on('click', function(e) {
			this.disabled = true;
			$(this).off('click');
			console.log("btn next was pressed");
			this._evaluateQuestion(1);
		});
	},

	_evaluateQuestion: function(selected) {
		this.selectedAnswer = null;
		if(1 == 1) {

		}
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

