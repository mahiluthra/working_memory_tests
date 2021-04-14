/*
 * Example plugin template
 */

jsPsych.plugins["spatial-span"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');


  plugin.info = {
    name: 'spatial-span',
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
      selected_box: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: "which box should be selected for this trial"
      },
      display_red_box: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        description: "should a rd box be marked"
      }
    }
  }


  plugin.trial = function(display_element, trial) {

// making matrix:
var grid = trial.grid_size;

var matrix = [];
for (var i=0; i<grid; i++){
  m1 = i;
  for (var h=0; h<grid; h++){
    m2 = h;
    matrix.push([m1,m2])
  }
};

red_box = trial.selected_box

    paper_size = grid*trial.size_cells;

    display_element.innerHTML = '<div id="jspsych-html-button-response-btngroup" style= "position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

    for (var i=0; i<matrix.length; i++){
    paper.innerHTML += '<div class="jspsych-grid" style="position: absolute; top:'+ matrix[i][0]*(trial.size_cells-3) +'px; left:'+matrix[i][1]*(trial.size_cells-3)+'px";><div class="whiteBox" /div></div>';
  }

  if (trial.display_red_box){
     paper.innerHTML += '<div class="jspsych-grid" style="position: absolute; top:'+ red_box[0]*(trial.size_cells-3) +'px; left:'+red_box[1]*(trial.size_cells-3)+'px";><div class="redBox" /div></div>';
   }

var start_time = Date.now();

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
    selected_square: red_box
  };

  // move on to the next trial
  jsPsych.finishTrial(trial_data);
}
};

  return plugin;
})();
