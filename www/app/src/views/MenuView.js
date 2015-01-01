define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer = require('famous/utilities/Timer');
    var Easing = require('famous/transitions/Easing');
    var StripView = require('views/StripView');

    function MenuView() {
        View.apply(this, arguments);

        _createStripViews.call(this);
        _setListeners.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        stripData: {},
        angle: -0.2,
        stripWidth: 320,
        stripHeight: 54,
        topOffset: 100,
        stripOffset: 57,
        staggerDelay: 35,
        transition: {
            duration: 400,
            curve: 'easeOut'
        }
    };

    function _createStripViews() {
        this.stripSurfaces = [];
        this.stripModifiers = [];
        var yOffset = this.options.topOffset;
        for (var i = 0; i < this.options.stripData.length; i++) {
            var stripView = new StripView({
                iconUrl: this.options.stripData[i].iconUrl,
                title: this.options.stripData[i].title
            });

            this.stripSurfaces.push(stripView);
            var stripModifier = new StateModifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.stripModifiers.push(stripModifier);
            this.add(stripModifier).add(stripView);

            yOffset += this.options.stripOffset;
        }
    }

    MenuView.prototype.resetStrips = function() {
        for (var i = 0; i < this.stripModifiers.length; i++) {
            var initX = -this.options.stripWidth;
            var initY = this.options.topOffset + this.options.stripOffset * i + this.options.stripWidth * Math.tan(-this.options.angle);

            this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
    };

    MenuView.prototype.animateStrips = function() {
        this.resetStrips();

        var transition = this.options.transition;
        var delay = this.options.staggerDelay;
        var stripOffset = this.options.stripOffset;
        var topOffset = this.options.topOffset;

        for (var i = 0; i < this.stripModifiers.length; i++) {
            Timer.setTimeout(function(i) {
                var yOffset = topOffset + stripOffset * i;

                this.stripModifiers[i].setTransform(
                    Transform.translate(0, yOffset, 0), transition);
            }.bind(this, i), i * delay);
        }
    };

    function _setListeners() {
        this.stripSurfaces[0].backgroundSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
         this.stripSurfaces[1].backgroundSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
          this.stripSurfaces[2].backgroundSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
           this.stripSurfaces[3].backgroundSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = MenuView;
});
