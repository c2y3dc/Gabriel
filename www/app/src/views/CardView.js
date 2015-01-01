define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function CardView() {
        View.apply(this, arguments);

        _createBackground.call(this);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.75
    };

    function _createBackground() {
      var backgroundSurface = new Surface({
        size: [this.options.width, this.options.height],
        properties: {
          backgroundColor: 'white',
          boxShadow: '0 0 1px rgba(0, 0, 0, 1)',
          borderRadius: '5px'
        }
      });

      var backgroundModifier = new StateModifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

      this.add(backgroundModifier).add(backgroundSurface);
    }
    module.exports = CardView;
});
