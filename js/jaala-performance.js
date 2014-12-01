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



  function Comparer(){
    this.tests = [];

    for(var i = 0; i < arguments.length; i++){
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
        var validate = testError(func);
        if (validate)
          return validate;

        timeStart = performance.now();
        func();
        timeEnd = performance.now();
        this.tests[i].starts = timeStart;
        this.tests[i].ends = timeEnd;
        this.tests[i].time = this.tests[i].ends - this.tests[i].starts;
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