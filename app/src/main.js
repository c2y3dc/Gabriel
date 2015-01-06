/* globals define */
'use strict'
define(function(require, exports, module) {
    function start() {
        console.log("start that app")
        // import dependencies
        var Engine = require('famous/core/Engine')
        var AppView = require('views/AppView')

        require('helpers/methods')
        // create the main context
        var mainContext = Engine.createContext()
        mainContext.setPerspective(2000)

        var appView = new AppView()
        mainContext.add(appView)
    }

    if (window.cordova)
        document.addEventListener('deviceready', start, false)
    else
        document.addEventListener('DOMContentLoaded', start)
})
