define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');
  var HeaderFooter = require('famous/views/HeaderFooterLayout');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var FastClick = require('famous/inputs/FastClick');


  function AboutView() {
    View.apply(this, arguments);

    _createBacking.call(this);
    _createLayout.call(this);
    _createHeader.call(this);
    _createBody.call(this);

    _setListeners.call(this);
  }

  AboutView.prototype = Object.create(View.prototype);
  AboutView.prototype.constructor = AboutView;

  AboutView.DEFAULT_OPTIONS = {
    width: window.innerWidth,
    height: window.innerHeight,
    headerSize: window.innerHeight * 0.097,
    footerSize: window.innerHeight * 0.167,
  };

  function _createBacking() {
    var backingSurface = new Surface({
      properties: {
        backgroundColor: 'rgb(253, 253, 253)'
      }
    });

    var backingModifier = new StateModifier({
      transform: Transform.translate(0, 0, 100)
    });

    this.add(backingModifier).add(backingSurface);
  }

  function _createLayout() {
    this.layout = new HeaderFooter({
      headerSize: this.options.headerSize,
      footerSize: this.options.footerSize
    });

    var layoutModifier = new StateModifier({
      transform: Transform.translate(0, 0, 1)
    });

    this.add(layoutModifier).add(this.layout);
  }

  function _createHeader() {
    var backgroundSurface = new Surface({
      properties: {
        backgroundColor: '#1976D2'
      }
    });

    var backgroundModifier = new StateModifier({
      transform: Transform.translate(0, this.options.headerSize * 0.2, 102),
    });

    this.layout.header.add(backgroundModifier).add(backgroundSurface);

    /*HEADER SURFACES*/
    this.backButtonSurface = new ImageSurface({
      size: [20, 20],
      content: 'img/back.svg'
    });

    this.titleSurface = new Surface({
      size: [true, 44],
      content: 'About',
      properties: {
        fontSize: '18px',
        color: 'white'
      }
    });

    /*HEADER MODIFIERS */
    var backButtonModifier = new StateModifier({
      transform: Transform.translate(this.options.width * 0.07, this.options.headerSize * 0.18, 102),
      origin: [0, 0],
      align: [0, 0.5]
    });

    var titleModifier = new StateModifier({
      transform: Transform.translate(this.options.width * 0.215, this.options.headerSize * 0.18, 102),
      origin: [0, 0],
      align: [0, 0.5]
    });

    this.layout.header.add(backButtonModifier).add(this.backButtonSurface);
    this.layout.header.add(titleModifier).add(this.titleSurface);
  }

  function _createBody() {
    var node = this.layout.content;

    this.bodySurface = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'rgb(253, 253, 253)'
      }
    });

    this.bodyModifier = new StateModifier({
      transform: Transform.behind
    });

    var teamBackgroundSurface = new ImageSurface({
      size: [this.options.width, this.options.height * 0.242],
      content: 'img/teamGabriel.png'
    });

    var teamBackgroundModifier = new StateModifier({
      transform: Transform.translate(0, this.options.height * 0.0213, 102),
      origin: [0.5, 0],
      align: [0.5, 0]
    });

    var teamLogoSurface = new ImageSurface({
      size: [this.options.width * 0.234, this.options.width * 0.234],
      // content: 'img/account.png',
      properties: {
        backgroundColor: '#04B9E6',
        borderRadius: '2px',
        border: '3px solid #FFFFFF',
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.30)'
      }
    })

    var teamLogoModifier = new StateModifier({
      transform: Transform.translate(this.options.width * 0.075, this.options.height * 0.22, 102),
      origin: [0, 0],
      align: [0, 0]
    });

    node.add(this.bodyModifier).add(this.bodySurface);
    node.add(teamBackgroundModifier).add(teamBackgroundSurface);
    node.add(teamLogoModifier).add(teamLogoSurface);
  }

  function _setListeners() {
    this.backButtonSurface.on('click', function() {
      console.log('aboutPage back button is clicked');
      this._eventOutput.emit('menuToggle');
    }.bind(this));
  }

  module.exports = AboutView;
});
