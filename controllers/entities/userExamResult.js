function userExamResult() {
    this.date = new Date();
    this.description = '';
    this.id = '';
    this.name = '';
    this.score = 0;
}


function userExamResultx() {
    var obj = {};

    obj.date = new Date();
    obj.description = '';
    obj.id = '';
    obj.name = '';
    obj.score = 0;
    obj.greeting = function() {
        console.log(this.name);
    }


}