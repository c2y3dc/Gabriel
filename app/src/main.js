/* globals define */
'use strict'
define(function(require, exports, module) {
    function start() {
        console.log("start that app")
            // import dependencies
        var Engine = require('famous/core/Engine')
        var AppView = require('views/AppView')
        var Utility = require('famous/utilities/Utility');

        require('helpers/methods')
            // create the main context
        var mainContext = Engine.createContext()
        mainContext.setPerspective(2000)

        var appView = new AppView();
        mainContext.add(appView);
    }

    if (window.cordova)

        document.addEventListener('deviceready', start, false);

    else{

        //UNCOMMENT THE LINE BELOW WHEN RUNNING ON MOBILE DEVICES
        // document.addEventListener('DOMContentLoaded', start)

        // COMMENT OUT BOTH LINES BELOW WHEN RUNNING ON MOBILE DEVICES
        require('../lib/oauth-js/dist/oauth.min.js');
        // require('jquery');
        start();

    }

});

