define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  function MenuHeaderView() {
    View.apply(this, arguments);

    _createBackground.call(this);
    _createUserImage.call(this);
    _createUserName.call(this);
  }

  MenuHeaderView.prototype = Object.create(View.prototype);
  MenuHeaderView.prototype.constructor = MenuHeaderView;

  MenuHeaderView.DEFAULT_OPTIONS = {
    width: window.innerWidth - window.innerWidth / 8,
    height: window.innerHeight * 0.3,
    userImageSize: window.innerHeight * 0.18,
    userImageUrl: 'img/userImage.svg',
    userName: 'Team Gabriel'
  };

  function _createBackground() {
    this.backgroundSurface = new Surface({
      size: [this.options.width, this.options.height],
      properties: {
        backgroundColor: '#2D2D2D'
      }
    });

    var backgroundModifier = new StateModifier({
      origin: [0, 0],
      align: [0, 0]
    });

    this.add(backgroundModifier).add(this.backgroundSurface);
  }

  function _createUserImage() {
    this.userImageSurface = new ImageSurface({
      size: [this.options.userImageSize, this.options.userImageSize],
      content: this.options.userImageUrl,
      properties: {
        backgroundColor: '#BEEB9F',
        borderRadius: this.options.userImageSize / 2 + 'px'
      }
    });

    var userImageModifier = new StateModifier({
      transform: Transform.translate(this.options.width / 2, this.options.height * 0.4, 0),
      origin: [0.5, 0.5],
      align: [0, 0]
    });

    this.add(userImageModifier).add(this.userImageSurface);
  }

  function _createUserName() {
    var userNameSurface = new Surface({
      size: [true, true],
      content: this.options.userName,
      properties: {
        color: 'white',
        textAlign: 'center'
      }
    });

    var userNameModifier = new StateModifier({
      transform: Transform.translate(this.options.width / 2, this.options.height * 0.85, 0),
      origin: [0.5, 0.5],
      align: [0, 0]
    });

    this.add(userNameModifier).add(userNameSurface);
  }
  module.exports = MenuHeaderView;
});
