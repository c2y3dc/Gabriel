/* globals define */
define(function(require, exports, module) {

    var AppView = require('views/AppView');
    var Engine = require('famous/core/Engine');

    function start() {
        //console.log("start that app");
        // import dependencies
        require('helpers/methods');
        // create the main context
        var mainContext = Engine.createContext();
        mainContext.setPerspective(2000);

        var appView = new AppView();
        mainContext.add(appView);
    }

    if (window.cordova) {
        document.addEventListener('deviceready', start, false);
        document.addEventListener('build', start, false);
        // Keyboard
        // - requires ionic keyboard plugin
        try {
            // disable keyboard scrolling
            cordova.plugins.Keyboard.disableScroll(true);
        } catch (err) {
            console.error(err, 'no Keyboard');
        }
        // add listeners for keyboard show/hide
        // 
        window.addEventListener('native.keyboardshow', keyboardShowHandler);

        function keyboardShowHandler(e) {
            var keyboardHeight = e.keyboardHeight;
            console.log('Keyboard height is: ' + e.keyboardHeight);
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        function keyboardHideHandler(e) {
            console.log('Hidden Keyboard');
        }

    } else {
        //UNCOMMENT THE LINE BELOW WHEN RUNNING ON MOBILE DEVICES
        document.addEventListener('DOMContentLoaded', start);
        //document.addEventListener('build', start);

        // COMMENT OUT BOTH LINES BELOW WHEN RUNNING ON MOBILE DEVICES
        //require('../lib/oauth-js/dist/oauth.min.js');
        //start();
        //require('../lib/oauth-js/dist/oauth.min.js');
        //start();
    }


});
