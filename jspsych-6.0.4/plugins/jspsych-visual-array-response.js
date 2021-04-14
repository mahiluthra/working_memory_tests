/**
 *
 * jspsych-visual-search-circle
 * Josh de Leeuw
 *
 * display a set of objects, with or without a target, equidistant from fixation
 * subject responds to whether or not the target is present
 *
 * based on code written for psychtoolbox by Ben Motz
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["visual-array-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-array-response', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-array-response', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-array-response', 'fixation_image', 'image');

  plugin.info = {
    name: 'visual-array-response',
    description: '',
    parameters: {
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [60, 60],
        description: 'Two element array indicating the height and width of the search array element images.'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [20, 20],
        description: 'Two element array indicating the height and width of the fixation image.'
      },
      circle_diameter: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter1',
        default: 260,
        description: 'The diameter of the search array circle in pixels.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      locs: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Previous stimuli locations',
        default: undefined,
        description: 'Picks up on previous locations to match them.'
      },
      cols: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Previous stimuli colours',
        default: undefined,
        description: 'Picks up on previous colours to match them.'
      },
      target_different: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Has the target changed?',
        default: undefined,
        description: 'States whether target has changed.'
      },
      target_same_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target same key',
        default: 's',
        description: 'The key to press if the target is same in the search array.'
      },
      target_different_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Target absent key',
        default: 'k',
        description: 'The key to press if the target is different in the search array.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

   //  // circle params
     var diam = trial.circle_diameter; // pixels
   //  var radi = diam / 2;
     var paper_size = diam + trial.target_size[0];

    // get target to draw on
    display_element.innerHTML += '<div id="jspsych-visual-array-response-container" style= "position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-visual-array-response-container");

    // check distractors - array?
    if(!Array.isArray(trial.foil)){
      fa = [];
      for(var i=0; i<trial.set_size; i++){
        fa.push(trial.foil);
      }
      trial.foil = fa;
    }

    var to_present = trial.cols
    var display_locs = trial.locs
    var sDifferent =  trial.target_different

    if (sDifferent){
      var colOptions = ["red", "blue", "yellow", "green", "purple", "black", "white"]
      index = colOptions.indexOf(to_present[0])
      colOptions.splice(index, 1)
      to_present[0] = jsPsych.randomization.sampleWithReplacement(colOptions, 1)[0]
    }

    // var response = {
    //   rt: null,
    //   key: null
    // };

    show_search_array();
    function show_search_array() {
      paper.innerHTML += "<img src='img/circle.png' style='position: absolute; top:"+(display_locs[0][0]-trial.target_size[0]*0.5)+"px; left:"+(display_locs[0][1]-trial.target_size[1]*0.5)+"px; width:"+(trial.target_size[0]*2)+"px; height:"+(trial.target_size[1]*2)+"px;'></img>";

      for (var i = 0; i < display_locs.length; i++) {
        paper.innerHTML += "<img src='img/"+to_present[i]+".png' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";
      }

      var trial_over = false;

      var after_response = function(info) {

        trial_over = true;

        var correct = false;

        if (jsPsych.pluginAPI.compareKeys(info.key,trial.target_different_key) && trial.target_different ||
            jsPsych.pluginAPI.compareKeys(info.key,trial.target_same_key) && !trial.target_different) {
          correct = true;
        }

        clear_display();

        end_trial(info.rt, correct, info.key);
      };

  var valid_keys = [];
  valid_keys.push(trial.target_different_key)
  valid_keys.push(trial.target_same_key)

  key_listener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: after_response,
    valid_responses: valid_keys,
    rt_method: 'date',
    persist: false,
    allow_held_key: false
  });

  if (trial.trial_duration !== null) {
    jsPsych.pluginAPI.setTimeout(function() {
      if (!trial_over) {
        jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);
        trial_over = true;
        var rt = null;
        var correct = 0;
        var key_press = null;
        clear_display();
        end_trial(rt, correct, key_press);
      }
    }, trial.trial_duration);
  }
  function clear_display() {
    display_element.innerHTML = '';
  }
}

function end_trial(rt, correct, key_press) {

  // data saving
  var trial_data = {
    correct: correct,
    rt: rt,
    key_press: key_press,
//    locations: JSON.stringify(display_locs),
    target_different: trial.target_different,
//    set_size: trial.set_size
  };

      // go to next trial
      jsPsych.finishTrial(trial_data);
    }
  };

  // helper function for determining stimulus locations

  function cosd(num) {
    return Math.cos(num / 180 * Math.PI);
  }

  function sind(num) {
    return Math.sin(num / 180 * Math.PI);
  }

  return plugin;
})();
