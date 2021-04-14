/*
 * Example plugin template
 */

jsPsych.plugins["spatial-span-recall"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');


  plugin.info = {
    name: 'spatial-span-recall',
    description: '',
    parameters: {
      grid_size: {
        type: jsPsych.plugins.parameterType.INT, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: 4,
        description: 'size of grid for stimuli.'
      },
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
var grid = trial.grid_size;
var recalledGrid = [];
var correctGrid = trial.correct_order
var nRecalled = 0
var nothing = " "
var acc = 0

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

var divArray = []
var ttArray = []
recordClick = function(data){
  var tt = data.getAttribute('id')
  var div = document.getElementById(tt);
  var tt = ("#"+tt)
  nRecalled += 1
  div.innerHTML = nRecalled
  display_element.querySelector(tt).className += '-responded';
  recalledGrid.push(data.getAttribute('data-choice'));
  console.log(recalledGrid)
  ttArray.push(tt)
  divArray.push(div)
}

clearSpace = function(){
  if (nRecalled>0){
  recalledGrid = recalledGrid.slice(0, (recalledGrid.length-1))
  console.log(recalledGrid)
  var div = divArray[divArray.length-1]
  var tt = ttArray[ttArray.length-1]
  nRecalled -= 1
  div.innerHTML = nothing
  display_element.querySelector(tt).className ="jspsych-btn-grid"
  divArray = divArray.slice(0, (divArray.length-1))
  ttArray = ttArray.slice(0, (ttArray.length-1))
}
  // for (i=0; i<matrix.length; i++){
  //  var id = "jspsych-spatial-span-grid-button-"+i
  //   var div = document.getElementById(id);
  //   div.innerHTML = nothing
  //   display_element.querySelector("#"+"jspsych-spatial-span-grid-button-"+i).className ="jspsych-btn-grid"
  // }
}

// blankSpace = function(){
//   recalledGrid.push("blank")
//   nRecalled+=1
// }

var matrix = [];
for (var i=0; i<grid; i++){
  m1 = i;
  for (var h=0; h<grid; h++){
    m2 = h;
    matrix.push([m1,m2])
  }
};

//red_box = trial.selected_box

    paper_size = grid*trial.size_cells;

    display_element.innerHTML = '<div style="font-size:24">RECALL<br><br></div>'
    display_element.innerHTML += '<div><br></div>'
    display_element.innerHTML += '<div id="jspsych-html-button-response-btngroup" style= "position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

    for (var i=0; i<matrix.length; i++){
    paper.innerHTML += '<div class="jspsych-btn-grid" style="position: absolute; top:'+ matrix[i][0]*(trial.size_cells-3) +'px; left:'+matrix[i][1]*(trial.size_cells-3)+'px"; id="jspsych-spatial-span-grid-button-' + i +'" data-choice="'+i+'" onclick="recordClick(this)">'+nothing+'</div>';// <img src="img/whitegrid.png" style= "width:'+trial.size_cells+'px; height:'+trial.size_cells+'px;"/img></button></div>';
  }

//  display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; position: relative; left:-42.5px;  margin:'+10+' '+0+'" id="jspsych-html-button-response-button-clear" onclick="blankSpace(this)">Blank</div>';

//display_element.innerHTML += '<div></n></div>'
  display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+30+' '+3+'" id="jspsych-html-button-response-button-clear" onclick="clearSpace(this)">Backspace</div>';

  display_element.innerHTML += '<div class="jspsych-btn-numpad" style="display: inline-block; margin:'+30+' '+30+'" id="jspsych-html-button-response-button">Continue</div>';


var start_time = Date.now();


    display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
          var acc = 0
          for (var i=0; i<correctGrid.length; i++){
            var id = indexOfArray(correctGrid[i], matrix)
            if (recalledGrid[i] == id){
              acc += 1
            }
          }
          console.log(acc)
          choice = 0
        console.log(indexOfArray(correctGrid[1], matrix), recalledGrid[1])
    after_response(acc);
  });

var response = {
  rt: null,
  button: null
};

// function checkResponse(){
//
// }
//
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
    stimuli: correctGrid,
    accuracy: response.button}

  // move on to the next trial
  jsPsych.finishTrial(trial_data);
}
};

  return plugin;
})();
