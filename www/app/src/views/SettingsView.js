define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');
  var HeaderFooter = require('famous/views/HeaderFooterLayout');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var FastClick = require('famous/inputs/FastClick');

  var SequentialLayoutView = require('views/SequentialLayoutView');

  function SettingsView() {
    View.apply(this, arguments);

    _createBacking.call(this);
    _createLayout.call(this);
    _createHeader.call(this);
    _createBody.call(this);

    _setListeners.call(this);
  }

  SettingsView.prototype = Object.create(View.prototype);
  SettingsView.prototype.constructor = SettingsView;

  SettingsView.DEFAULT_OPTIONS = {
    headerSize: 44,
    headerWidth: window.innerWidth,
  };

  function _createBacking() {
    var backing = new Surface({
      properties: {
        backgroundColor: 'black',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }
    });

    this.add(backing);
  }


  function _createLayout() {
    this.layout = new HeaderFooter({
      headerSize: this.options.headerSize,
      footerSize: this.options.footerSize
    });

    var layoutModifier = new StateModifier({
      transform: Transform.translate(0, 0, 0.1)
    });

    this.add(layoutModifier).add(this.layout);
  }

  function _createHeader() {
    var backgroundSurface = new Surface({
      classes: ['ionic-blue-background']
    });

    var backgroundModifier = new StateModifier({
      transform: Transform.inFront
    });

    this.layout.header.add(backgroundModifier).add(backgroundSurface);

    /*HEADER SURFACES*/
    this.hamburgerSurface = new ImageSurface({
      size: [44, 44],
      content: 'img/hamburger.png'
    });

    this.titleSurface = new Surface({
      size: [true, 44],
      content: 'Settings',
      classes: ['header-title']
    });

    /*HEADER MODIFIERS */
    var hamburgerModifier = new StateModifier({
      transform: Transform.inFront,
      origin: [0, 0.5],
      align: [0, 0.5]
    });

    var titleModifier = new StateModifier({
      transform: Transform.inFront,
      origin: [0.5, 0],
      align: [0.5, 0.3]
    });

    this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
    this.layout.header.add(titleModifier).add(this.titleSurface);
  }

  function _createBody() {
    var node = this.layout.content;

    this.bodySurface = new Surface({
      size: [undefined, undefined],
      classes: ['main-body-background']
    });

    this.bodyModifier = new StateModifier({
      transform: Transform.behind
    });

    var settingsList = new SequentialLayoutView();

    var settingsListModifier = new StateModifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5]
    });

    node.add(this.bodyModifier).add(this.bodySurface);
    node.add(settingsListModifier).add(settingsList);
  }

  function _setListeners() {
    this.hamburgerSurface.on('click', function() {
      this._eventOutput.emit('menuToggle');
    }.bind(this));
  }

  module.exports = SettingsView;
});
