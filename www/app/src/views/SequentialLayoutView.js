define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var SequentialLayout = require("famous/views/SequentialLayout");

  function SequentialLayoutView() {
    View.apply(this, arguments);

    _createSequentialLayoutView.call(this);
  }

  SequentialLayoutView.prototype = Object.create(View.prototype);
  SequentialLayoutView.prototype.constructor = SequentialLayoutView;

  SequentialLayoutView.DEFAULT_OPTIONS = {};

  function _createSequentialLayoutView() {
    var sequentialLayoutView = new SequentialLayout({
      direction: 1
    });

    var sequentialLayoutSurfaces = [];

    sequentialLayoutView.sequenceFrom(sequentialLayoutSurfaces);

    for (var i = 0, temp; i < 8; i++) {
      sequentialLayoutSurface = new Surface({
        content: 'Surface #' + (i + 1),
        size: [undefined, 50],
        properites: {
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(82, 101, 107, 0.2)',
          lineHeight: '75px',
          textAlign: 'center'
        }
      });
      sequentialLayoutSurfaces.push(sequentialLayoutSurface);
    }

    this.add(sequentialLayoutView);
  }
  module.exports = SequentialLayoutView;
});
