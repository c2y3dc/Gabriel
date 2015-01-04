/*global OAuth */
'use strict';

// load css
require('./styles');

// Load polyfills
require('famous-polyfills');

require('oauth-js');

// import dependencies
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var ImageSurface = require('famous/surfaces/ImageSurface');

// create the main context
var mainContext = Engine.createContext();

// your app here
var logo = new ImageSurface({
  size: [200, 200],
  content: 'images/famous_logo.png',
  classes: ['backfaceVisibility']
});

var initialTime = Date.now();
var centerSpinModifier = new Modifier({
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  transform: function () {
    return Transform.rotateY(0.002 * (Date.now() - initialTime));
  }
});

mainContext.add(centerSpinModifier).add(logo);


OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
OAuth.popup('angel_list').done(function (result) {
  result.get('/1/jobs').done(function (data) {
    console.log(data);
  }).fail(function (oops) {
    console.log('oops');
  });
});


