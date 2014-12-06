(function (window, document) {
  var editors = [];

  function Editor(selector){
    this.codeControl = document.querySelector(selector).querySelector('code-editor');

    this.nameControl = document.querySelector(selector).querySelector('paper-input');

    this.code = function code(){
      return this.codeControl.editor.doc.getValue()
    }
    this.name = function name(){
      return this.nameControl.value;
    }
    editors.push(this);
  }

  function testError(func){
    try{
      func();
      return undefined;
    }catch(ex){
      return ex;
    }
  }

  function plusArray(arr){
    var value = 0;
    for(var i = 0; i < arr.length; i++){
      value = value + arr[i];
    }
    return value;
  }



  function Comparer(){
    this.opts = arguments[0];
    this.tests = [];

    for(var i = 1; i < arguments.length; i++){
      this.tests.push({
        name: arguments[i].name(),
        code: arguments[i].code(),
        starts: undefined,
        ends: undefined,
        time: undefined,
        bestTime: undefined
      });
    }

    this.run = function run(){
      this.bestTime = undefined;
      for(var i = 0; i < this.tests.length; i++){
        var func      = new Function([], this.tests[i].code);
        var timeStart = undefined;
        var timeEnd   = undefined;
        var results   = [];
        var validate = testError(func);
        if (validate)
          return validate;
        for (var j = 1; j <= this.opts.repeats; j++){
          timeStart = performance.now();
          func();
          timeEnd = performance.now();
          results.push(timeEnd - timeStart);
        }
        

        if (this.opts.repeats == 1){
          this.tests[i].starts = timeStart;
          this.tests[i].ends = timeEnd;
        }

        this.tests[i].time = plusArray(results) / this.opts.repeats;
        this.bestTime = 
          this.bestTime > this.tests[i].time || this.bestTime == undefined 
          ? this.tests[i].time 
          : this.bestTime;
      }
    };

  }
  window.Editor = Editor;
  window.Comparer = Comparer;
})(window, document);