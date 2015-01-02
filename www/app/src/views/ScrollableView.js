define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Scrollview = require('famous/views/Scrollview');

  function ScrollableView() {
    View.apply(this, arguments);

    _createScrollableView.call(this);
  }

  ScrollableView.prototype = Object.create(View.prototype);
  ScrollableView.prototype.constructor = ScrollableView;

  ScrollableView.DEFAULT_OPTIONS = {};

  function _createScrollableView() {
    var scrollableView = new Scrollview();
    var scrollableSurfaces = [];

    scrollableView.sequenceFrom(scrollableSurfaces);

    for (var i = 0, temp; i < 20; i++) {
      temp = new Surface({
        content: 'Surface #' + (i + 1),
        size: [undefined, 75],
        properties: {
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(82, 101, 107, 0.2)',
          lineHeight: '75px',
          textAlign: 'center'
        }
      });

      temp.pipe(scrollableView);
      scrollableSurfaces.push(temp);
    }

    this.add(scrollableView);
  }
  module.exports = ScrollableView;
});
