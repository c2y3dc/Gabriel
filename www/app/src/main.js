/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');
    var AppView = require('views/AppView');
    // import SlideData
    var OAuth = require('lib/oauth-js/dist/oauth.min.js');
    var SlideData = require('data/SlideData');
    var JobsData = require('data/JobsData');
    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(2000);

    String.prototype.trunc = String.prototype.trunc ||
        function(n) {
            return this.length > n ? this.substr(0, n - 1) + '&hellip;' : this;
        };

    var url = 'http://api.angel.co/1/jobs';
    //var introUrl = 'http://api.angel.co/1/intros'
    // var note = {
    //     "id": 59320,
    //     "startup_id": 6702,
    //     "user_id": 671,
    //     "created_at": "2013-09-16T22:34:00Z",
    //     "intro_count": 1,
    //     "pending": true,
    //     "note": "Do you have time to meet for coffee in SF sometime this week?"
    // }


    //JobData.intro(introUrl, note);

    // var getJobs = function(data, i) {
    //     JobData.jobs[i] = data.jobs;
    //     console.log(JobData.jobs)
    //     if (Object.keys(JobData.jobs).length === 1) {
    //         initApp(JobData.jobs);
    //     };
    // };


    // for (var i = 0; i < 1; i++) {
    //     console.log('CURRENT PAGE IS', i + 1);
    //     JobData.fetch(url, i, getJobs);
    // }
    initApp(JobsData)

    function initApp(data) {

        var appView = new AppView({
            jobs: data
        });
        mainContext.add(appView);
    }
});
