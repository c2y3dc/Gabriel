/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');
    var AppView = require('views/AppView');
    // import SlideData
    var SlideData = require('data/SlideData');

    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);


    Utility.loadURL(SlideData.getUrl(), initApp);

    function initApp(data) {
        // parses out reponse data and retrieves array of urls
        data = SlideData.parse(data);

        // instantiates AppView with our url data
        var appView = new AppView({ data : data });

        mainContext.add(appView);
    }
});
