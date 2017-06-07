# Welcome to QEx
QEx is a modern open-source Web App for launch online exams *build* with AngularJs and JavaScript.

How to install and run QEx
-------------------------------
#### Download

Only need to download the latest stable build.

#### Config Exam

Configure your data exam in the section **ExamModule** in the  exam.js file
* **id:** ID of your exam
* **title:** The title of your exam
* **description:** Description of your exam
* **path:** Path of your exam file and your snippets (if you have a snippets)
* **snippetName:** The name of the snippet.html (if your exam have a snippets)
* **displayProgressBar:** Set to true if you want to show a progress bar in the exam
* **displayExamFinished:** Set to true if you want to show the result of your exam when the user finish it
* **lockDevTools:** Lock `F12 key` and `Ctrl + Shift + i key`
* **linkedToFiredb:** Set to true if you want connect with a firebase db
* **sarcasticMode:** Show the shared with facebook button at the end of exam (it's only a joke)

#### Configure Firebase DB (optional)

Configure your firebase in the section **Firebase Namespace** in exam.js file
You only need to set your firebase info if you want connect with firebase if you don't use firebase, just turn off the property **linkedToFiredb** in ExamModule
* apiKey
* authDomain
* databaseURL
* projectId
* storageBucket
* messagingSenderId

#### Make your exam file.json 

You can check or modify the example exam file in this repo (**exams/JavaScript/fundamentals**) or make your own 
following the next structure. 

```
[
	{
		"id": "q[n]",
		"question": "Your question here",
		choices: [
			{
				"answer": "Posible answer 1",
				"correct" [false|true]
			},
			{
				"answer": "Posible answer 2",
				"correct": [false|true]
			}
			.
			.
			.
		],
		"haveSnippet": [false|true],
		"userAnswer": null
	},
	.
	.
	.
]
```
#### Puslish The Web App
Just publish you exam in your server or online.

#### Online Exam
You can check an exam make it with QEx here: [Essential Theory & Fundamentals Of JavaScript](https://jsexam-b9436.firebaseapp.com/#/results)

#### Contact Info
 * **Email:** [quethzel@gmail.com](mailto:quethzel@gmail.com)
