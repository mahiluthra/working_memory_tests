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

jsPsych.plugins["visual-array-stimuli"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-array-stimuli', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-array-stimuli', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-array-stimuli', 'fixation_image', 'image');

  plugin.info = {
    name: 'visual-array-stimuli',
    description: '',
    parameters: {
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size1',
        default: undefined,
        description: 'How many items should be displayed?'
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
        default: 250,
        description: 'The maximum duration to wait for a response.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // circle params
    var diam = trial.circle_diameter; // pixels
    var radi = diam / 2;
    var paper_size = diam + trial.target_size[0];

    // stimuli width, height
    var stimh = trial.target_size[0];
    var stimw = trial.target_size[1];
    var hstimh = stimh / 2;
    var hstimw = stimw / 2;

   //fixation location
   var centre_loc = [Math.floor(paper_size / 2 - trial.target_size[0] / 2), Math.floor(paper_size / 2 - trial.target_size[1] / 2)];

    var display = [centre_loc];
    var possible_display_locs1 = 5;
    var random_offset1 = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs1; i++) {
      display.push([
        Math.floor(paper_size / 2 + (cosd(random_offset1 + (i * (360 / possible_display_locs1))) * 27) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset1 + (i * (360 / possible_display_locs1))) * 27) - hstimh)
      ]);
    }

    var possible_display_locs2 = 10;
    var random_offset2 = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs2; i++) {
      display.push([
        Math.floor(paper_size / 2 + (cosd(random_offset2 + (i * (360 / possible_display_locs2))) * 55) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset2 + (i * (360 / possible_display_locs2))) * 55) - hstimh)
      ]);
    }

    var possible_display_locs3 = 16;
    var random_offset3 = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs3; i++) {
      display.push([
        Math.floor(paper_size / 2 + (cosd(random_offset3 + (i * (360 / possible_display_locs3))) * 83) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset3 + (i * (360 / possible_display_locs3))) * 83) - hstimh)
      ]);
    }

    var possible_display_locs4 = 18;
    var random_offset4 = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs4; i++) {
      display.push([
        Math.floor(paper_size / 2 + (cosd(random_offset4 + (i * (360 / possible_display_locs4))) * 110) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset4 + (i * (360 / possible_display_locs4))) * 110) - hstimh)
      ]);
    }

    var number_stim = trial.set_size;
    var weights = Array(display.length).fill(10)
    var display_locs = []
    for(var i = 0; i<number_stim; i++){
      var addStim = jsPsych.randomization.sampleWithReplacement(display,1, weights)[0];
      var id = display.indexOf(addStim);
      if (id!=(display.length-1)){
        weights[id+1] = 0.2
      };
      if (id!=0){
        weights[id-1] = 0.2
      };
      display.splice(id,1);
      weights.splice(id,1);
      display_locs.push(addStim);
    }


    // get target to draw on
    display_element.innerHTML += '<div id="jspsych-visual-search-circle-container" style= "position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-visual-search-circle-container");

    // check distractors - array?
    if(!Array.isArray(trial.foil)){
      fa = [];
      for(var i=0; i<trial.set_size; i++){
        fa.push(trial.foil);
      }
      trial.foil = fa;
    }

    var to_present = jsPsych.randomization.sampleWithReplacement(["red", "white", "purple", "green", "blue", "black", "yellow"], number_stim)

    show_search_array();

    function show_search_array() {

      for (var i = 0; i < display_locs.length; i++) {
        paper.innerHTML += "<img src='img/"+to_present[i]+".png' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";
      }

        // var buttons = [];
        // if (Array.isArray(trial.button_html)) {
        //   if (trial.button_html.length == trial.choices.length) {
        //     buttons = trial.button_html;
        //   } else {
        //     console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
        //   }
        // } else {
        //   for (var i = 0; i < trial.choices.length; i++) {
        //     buttons.push(trial.button_html);
        //   }
        // }
        // paper.innerHTML += '<div id="jspsych-html-button-response-btngroup">';
        // for (var i = 0; i < trial.choices.length; i++) {
        //   var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        //     paper.innerHTML += '<div class="jspsych-html-button-response-button"  style= "position: absolute; top:550px; left:'+paper_size/2+'; display: inline-block" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
        // }
        //   paper.innerHTML += '</div>';

      // display_element.innerHTML += '<div style="display: inline-block; margin:140px 0px" /div>'

  var start_time = Date.now();

  // add event listeners to buttons
  // for (var i = 0; i < trial.choices.length; i++) {
  //   display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
  //     var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
  //     after_response(choice);
  //   });
  // }

  // function to handle responses by the subject
  // function after_response(choice) {
  //
  //   // after a valid response, the stimulus will have the CSS class 'responded'
  //   // which can be used to provide visual feedback that a response was recorded
  //   display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';
  //
  //   // disable all the buttons after a response
  //   var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
  //   for(var i=0; i<btns.length; i++){
  //     //btns[i].removeEventListener('click');
  //     btns[i].setAttribute('disabled', 'disabled');
  //   }
  //   clear_display();
  //     end_trial();
  // };

    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        clear_display();
        end_trial();
      }, trial.trial_duration);
    }


      function clear_display() {
        display_element.innerHTML = '';
      }
    }


    function end_trial() {
      jsPsych.pluginAPI.clearAllTimeouts();

      // data saving
      var trial_data = {
        set_size: trial.set_size,
        locations: display_locs,
        colours: to_present
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
