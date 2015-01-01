define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');

    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.register('spring', SnapTransition);

    var CardView = require('views/CardView');

    var posititon = new Transitionable([0, 0]);

    GenericSync.register({
      'mouse': MouseSync,
      'touch': TouchSync
    });

    function AppView() {
        View.apply(this, arguments);

        this.cardViewPos = new Transitionable([0, 0]);

        _createCardView.call(this);

        _handleDrag.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {};

    function _createCardView() {
      this.cardView = new CardView();

      this.cardModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

      this.add(this.cardModifier).add(this.cardView);
    }

    function _handleDrag() {
      var sync = new GenericSync({
        'mouse': {},
        'touch': {}
      });

      this.cardView.pipe(sync);

      sync.on('update', function(data) {
        var currentPosititon = this.cardViewPos.get();
        this.cardViewPos.set([
          currentPosition[0] + data.delta[0],
          currentPosition[1] + data.delta[1],
        ]);
      }.bind(this));

      sync.on('end', function(data) {
        var velocity = data.velocity;
        this.cardViewPos.set([0, 0], {
          method: 'spring',
          period: 150,
          velocity: velocity
        });
      }.bind(this));

      console.log('posititon', this.cardViewPos);
      var positionModifier = new Modifier({
        transform: function() {
          var currentPosition = this.cardViewPos.get();
          return Transform.translate(currentPosition[0], currentPosition[1], 0);
        }.bind(this)
      });

      var rotationModifier = new Modifier({
        transform: function() {
          var currentPosition = this.cardViewPos.get();
          return Transform.rotateZ(-0.002 * currentPosition[0]);
        }.bind(this)
      });

      this.add(positionModifier).add(rotationModifier);
    }
    module.exports = AppView;
});
