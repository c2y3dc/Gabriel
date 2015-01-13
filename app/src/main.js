/* globals define */
'use strict'
define(function(require, exports, module) {
        var AppView = require('views/AppView');
        var Engine = require('famous/core/Engine');
    function start() {
        console.log("start that app");
        // import dependencies

        require('helpers/methods');
        // require('jquery');
        // create the main context
        var mainContext = Engine.createContext();
        mainContext.setPerspective(2000);

        appView = new AppView();
        mainContext.add(appView);
    }



    if (window.cordova)

        document.addEventListener('deviceready', start, false);

    else {

        //UNCOMMENT THE LINE BELOW WHEN RUNNING ON MOBILE DEVICES

        document.addEventListener('DOMContentLoaded', start);
        


        // COMMENT OUT BOTH LINES BELOW WHEN RUNNING ON MOBILE DEVICES
        require('../lib/oauth-js/dist/oauth.min.js');
        start();

    }

});
