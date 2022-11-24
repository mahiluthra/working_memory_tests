# Working Memory Tests
Working memory experiment tasks designed on JavaScript


Four classic working memory (WM) tests are included in this directory. All have been designed on JavaScript using the jsPsych library (https://www.jspsych.org/). These WM tests have previously been used in lab experiments (data from experiments is included in directory). Paper resulting from these experiments can be found here: https://mindmodeling.org/cogsci2019/papers/0141/index.html.

Since these tasks are browser based, they can be conveniently used for online experiments (e.g., on MTurk). However, given that online experiments have less controlled environments, the reliability of WM measures might be affected.

1) **Digit span test.** This is a verbal-numeric WM storage task. Methods from this test resemble those descibed in Woods et al (2011; https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2978794/). Participants are required to memorize a string of digits and recall them. A demonstration of the task can be viewed here: https://abcwest.cogs.indiana.edu/mkl/WM_battery/digit_span_task.html.

2) **Operation span test.** This is a verbal-numeric WM processing task. Methods from this task resemble those described in Oswald et al (2014; https://link.springer.com/article/10.3758/s13428-014-0543-2). Participants are required to memorize a string of letters while simultaneously performing simple mathematical calculations. A demonstration of the task can be viewed here: https://abcwest.cogs.indiana.edu/mkl/WM_battery/operation_span_task.html.

3) **Visual array test.** This is a visuo-spatial WM storage task. Methods from this test resemble those described in Cowan et al (2006; https://www.ncbi.nlm.nih.gov/pubmed/17489300). Participants have to quickly memorize colors of squares and detect changes. A demonstration of the task can be viewed here: https://abcwest.cogs.indiana.edu/mkl/WM_battery/visual_array_task.html.

4) **Symmetry span test.** This is a visuo-spatial WM processing task. Methods from this task resemble those described in Oswald et al (2014; https://link.springer.com/article/10.3758/s13428-014-0543-2). Participants are required to memorize locations of colored squares on a grid while simultaneously performing simple symmetry judgement decisions. A demonstration of the task can be viewed here: https://abcwest.cogs.indiana.edu/mkl/WM_battery/symmetry_span_task.html.


Each of these tasks can be customized to some extent (number of trials, set size in trials, trial duration etc). Easily customizable variables have been listed at the top of each code. Please download all folders in this directory for use of any of the tasks (i.e., 'jspsych-6.0.4' and 'img'). Results from the task can either be stored locally or on a server (through use of an included .php script). Please cite the paper (https://mindmodeling.org/cogsci2019/papers/0141/index.html) if using the tests or the data. If more information is needed, get in touch :)

APA Citation: [Luthra, M., & Todd, P. M. (2019). Role of working memory on strategy use in the probability learning task. In A. Goel, C. Seifert, & C. Freksa (Eds.), Proceedings of the 41st Annual Conference of the Cognitive Science Society (pp. 721–728). Montreal, QB: Cognitive Science Society.]
