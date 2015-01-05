/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');

    require('helpers/methods');
    // create the main context
    var mainContext = Engine.createContext();
    mainContext.setPerspective(2000);

    var appView = new AppView();
    mainContext.add(appView);

});
