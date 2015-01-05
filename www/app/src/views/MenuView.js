define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer = require('famous/utilities/Timer');
    var Surface = require('famous/core/Surface');

    var StripView = require('views/StripView');
    var MenuHeaderView = require('views/MenuHeaderView');

    function MenuView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createMenuHeader.call(this);

        _createStripViews.call(this);
        _setListeners.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        headerSize: window.innerHeight * 0.44,
        stripData: {},
        angle: -0.2,
        stripWidth: window.innerWidth * 2,
        stripHeight: 54,
        topOffset: window.innerHeight * 0.47,
        stripOffset: 57,
        staggerDelay: 35,
        transition: {
            duration: 400,
            curve: 'easeOut'
        }
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'white'
            }
        });
        this.add(backing);
    }

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

    function _createMenuHeader() {
        this.menuHeaderView = new MenuHeaderView();

        this.add(this.menuHeaderView);
    }

    // MenuView.prototype.resetStrips = function() {
    //     for (var i = 0; i < this.stripModifiers.length; i++) {
    //         var initX = -this.options.stripWidth;
    //         var initY = this.options.topOffset + this.options.stripOffset * i + this.options.stripWidth * Math.tan(-this.options.angle);
    //
    //         this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
    //     }
    // };

    // MenuView.prototype.animateStrips = function() {
    //     this.resetStrips();
    //
    //     var transition = this.options.transition;
    //     var delay = this.options.staggerDelay;
    //     var stripOffset = this.options.stripOffset;
    //     var topOffset = this.options.topOffset;
    //
    //     for (var i = 0; i < this.stripModifiers.length; i++) {
    //         Timer.setTimeout(function(i) {
    //             var yOffset = topOffset + stripOffset * i;
    //
    //                               this.stripModifiers[i].setTransform(
    //                 Transform.translate(0, yOffset, 0), transition);
    //         }.bind(this, i), i * delay);
    //     }
    // };

    function _setListeners() {
        // Menu surface
        this.menuHeaderView.userImageSurface.on('click', function() {
            this._eventOutput.emit('gabrielOnly');
        }.bind(this));
        // Home StripView
        this.stripSurfaces[0].backgroundSurface.on('click', function() {
            console.log('home is clicked');
            this._eventOutput.emit('gabrielOnly');
        }.bind(this));
        // About StripView
        this.stripSurfaces[1].backgroundSurface.on('click', function() {
            this._eventOutput.emit('aboutOnly');
        }.bind(this));
        // Settings StripView
        this.stripSurfaces[2].backgroundSurface.on('click', function() {
            this._eventOutput.emit('settingsOnly');
        }.bind(this));
        // Share Gabriel StripView
        this.stripSurfaces[3].backgroundSurface.on('click', function() {
            this._eventOutput.emit('sharingOnly');
        }.bind(this));
        // Rate Our App StripView
        this.stripSurfaces[3].backgroundSurface.on('click', function() {
            this._eventOutput.emit('rateOnly');
        }.bind(this));
    }
    module.exports = MenuView;
});
