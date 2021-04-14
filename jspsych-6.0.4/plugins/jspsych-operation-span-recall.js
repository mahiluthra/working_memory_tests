/*
 * Example plugin template
 */

jsPsych.plugins["operation-span-recall"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');


  plugin.info = {
    name: 'operation-span-recall',
    description: '',
    parameters: {
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      size_cells: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 70,
        description: 'How long to show the trial.'
      },
      correct_order: {
        type:jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'Recored the correct array'
      }
    }
  }


  plugin.trial = function(display_element, trial) {

// making matrix:
var grid = 3;
var recalledGrid = [];
var correctLetters = trial.correct_order
var display = " "

var setSize = correctLetters.length
var leftOver = 12-setSize


function indexOfArray(val, array) {
  var
    hash = {},
    indexes = {},
    i, j;
  for(i = 0; i < array.length; i++) {
    hash[array[i]] = i;
  }
  return (hash.hasOwnProperty(val)) ? hash[val] : -1;
};

var numbertobutton = {
  "0": "F",
  "1": "H",
  "2": "J",
  "3": "K",
  "4": "L",
  "5": "N",
  "6": "P",
  "7": "Q",
  "8": "R",
  "9": "S",
  "10": "T",
  "11": "V"
}

function indexOfArray(val, array) {
  var
    hash = {},
    indexes = {},
    i, j;
  for(i = 0; i < array.length; i++) {
    hash[array[i]] = i;
  }
  return (hash.hasOwnProperty(val)) ? hash[val] : -1;
};

recordClick = function(data){
  var tt = data.getAttribute('id')
  var tt = ("#"+tt)
  display_element.querySelector(tt).className = 'jspsych-operation-span-recall';
  var recalledN = (data.getAttribute('data-choice'));
  recalledGrid.push(numbertobutton[recalledN])
  var div = document.getElementById('recall_space');
  display += numbertobutton[recalledN] + " "
  div.innerHTML = display;
//  console.log(recalledGrid)
}

clearSpace = function(data){
  recalledGrid = recalledGrid.slice(0, (recalledGrid.length-1))
  console.log(recalledGrid)
  var div = document.getElementById('recall_space');
  display = display.slice(0, (display.length-2))
  div.innerHTML = display
}

var matrix = [];
for (var i=0; i<4; i++){
  m1 = i;
  for (var h=0; h<3; h++){
    m2 = h;
    matrix.push([m1,m2])
  }
};

var paper_size = [(3*(trial.size_cells+30)), ((4*(trial.size_cells+20))+100)];

display_element.innerHTML = '<div id="jspsych-html-button-response-btngroup" style= "position: relative; width:' + paper_size[0] + 'px; height:' + paper_size[1] + 'px"></div>';
var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

paper.innerHTML += '<div class="recall-space" style="position: absolute; top:'+ 0 +'px; left:'+(paper_size[0]/2-310)+'px; width:600px; height:64px" id="recall_space">'+ recalledGrid+'</div>';


var buttons = ["F","H","J","K","L","N","P","Q","R","S","T","V"]

for (var i = 0; i < matrix.length; i++) {
    var str = buttons[i]
    paper.innerHTML += '<div class="jspsych-operation-span-recall" style="position: absolute; top:'+ (matrix[i][0]*(trial.size_cells+20)+80) +'px; left:'+matrix[i][1]*(trial.size_cells+30)+'px; width:'+(trial.size_cells-6)+'px; height:'+(trial.size_cells-6)+'px"; id="jspsych-spatial-span-grid-button-' + i +'" data-choice="'+i+'" onclick="recordClick(this)">'+str+'</div>';
  }


  display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+10+' '+2+'" id="jspsych-html-button-response-button-clear" onclick="clearSpace(this)">Backspace</div>';

  display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+10+' '+40+'" id="jspsych-html-button-response-button">Continue</div>';


var start_time = Date.now();

    display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
      var acc=0
      for (var i=0; i<correctLetters.length; i++){
        if (recalledGrid[i] == correctLetters[i]){
          acc += 1
        }
      }
    //  console.log(correctLetters, )
    //console.log(indexOfArray(correctGrid[1], matrix), recalledGrid[1])
after_response(acc);
});

var response = {
  rt: null,
  button: null
};


function after_response(choice) {

  // measure rt
  var end_time = Date.now();
  var rt = end_time - start_time;
  var choiceRecord = choice;
  response.button = choice;
  response.rt = rt;

  // after a valid response, the stimulus will have the CSS class 'responded'
  // which can be used to provide visual feedback that a response was recorded
  //display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

  // disable all the buttons after a response
  var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
  for(var i=0; i<btns.length; i++){
    //btns[i].removeEventListener('click');
    btns[i].setAttribute('disabled', 'disabled');
  }

  clear_display();
    end_trial();
};

if (trial.trial_duration !== null) {
  jsPsych.pluginAPI.setTimeout(function() {
    clear_display();
    end_trial();
  }, trial.trial_duration);
}

function clear_display(){
    display_element.innerHTML = '';
}


function end_trial() {

  // kill any remaining setTimeout handlers
  jsPsych.pluginAPI.clearAllTimeouts();

  // gather the data to store for the trial
  var trial_data = {
    rt: response.rt,
    recall: recalledGrid,
    stimuli: correctLetters,
    accuracy: response.button
  };

  // move on to the next trial
  jsPsych.finishTrial(trial_data);
}
};

  return plugin;
})();
