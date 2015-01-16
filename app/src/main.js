/* globals define */
define(function(require, exports, module) {

    var AppView = require('views/AppView');
    var Engine = require('famous/core/Engine');
    var Timer = require('famous/utilities/Timer');

    function start() {
        //console.log("start that app");
        // import dependencies
        require('helpers/methods');



        // Engine.setOptions({appMode: false});
        // document.body.classList.add('famous-root');
        // document.documentElement.classList.add('famous-root');

        // window.addEventListener('touchmove', function(e){
        //     var classes = e.target.classList
        //     // var hasClassIWant = Array.prototype.indexOf.call(classes, 'back-card-desc')
        //     if (classes[0] == 'back-card-desc' || classes[0] == 'scroll-container'){
        //         console.log('yay');
        //     }else{
        //      e.preventDefault();
               
        //     }        
        // })



        // create the main context
        var mainContext = Engine.createContext();
        mainContext.setPerspective(2000);

        var appView = new AppView();
        mainContext.add(appView);

        // Timer.setInterval(function() {
        //     console.log('After tick=', mainContext.getSize());
        // }, 1000);
    }

    if (window.cordova) {
        document.addEventListener('deviceready', start, false);
// <<<<<<< HEAD
        //document.addEventListener('build', start, false);
        // Keyboard
        // - requires ionic keyboard plugin
        try {
            // disable keyboard scrolling
            cordova.plugins.Keyboard.disableScroll(true);
            //keyboardHeight = 260;
        } catch (err) {
            console.error(err, 'no Keyboard');
        }
        // add listeners for keyboard show/hide
        // 
        window.addEventListener('native.keyboardshow', keyboardShowHandler);

        function keyboardShowHandler(e) {
            console.log('hello');
            var keyboardHeight = e.keyboardHeight;
            console.log('Keyboard height is: ' + e.keyboardHeight);
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        function keyboardHideHandler(e) {
            console.log('Hidden Keyboard');
        }

    }else {

        //UNCOMMENT THE LINE BELOW WHEN RUNNING ON MOBILE DEVICES
        document.addEventListener('DOMContentLoaded', start);
        //document.addEventListener('build', start);

        // COMMENT OUT BOTH LINES BELOW WHEN RUNNING ON MOBILE DEVICES

        require('../lib/oauth-js/dist/oauth.min.js');
        start();

    }


});
