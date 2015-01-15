/* globals define */
'use strict'
define(function(require, exports, module) {

        var AppView = require('views/AppView');
        var Engine = require('famous/core/Engine');

    function start() {
        //console.log("start that app");
        // import dependencies
        require('helpers/methods');

        Engine.setOptions({appMode: false});
        document.body.classList.add('famous-root');
        document.documentElement.classList.add('famous-root');

        // create the main context
        var mainContext = Engine.createContext();
        mainContext.setPerspective(2000);

        var appView = new AppView();
        mainContext.add(appView);
    }

    if (window.cordova){
        document.addEventListener('deviceready', start, false);
        document.addEventListener('build', start, false);
    }else {
        //UNCOMMENT THE LINE BELOW WHEN RUNNING ON MOBILE DEVICES
        // document.addEventListener('DOMContentLoaded', start);
        //document.addEventListener('build', start);
        
        // COMMENT OUT BOTH LINES BELOW WHEN RUNNING ON MOBILE DEVICES
        require('../lib/oauth-js/dist/oauth.min.js');
        start();
        // require('../lib/oauth-js/dist/oauth.min.js');
        // start();
    }


});
