define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var SlideData = require('data/SlideData');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var ScrollSync = require("famous/inputs/ScrollSync");
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.registerMethod('spring', SnapTransition);

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    var position = new Transitionable([0, 0]);

    // runs once for each new instance
    function SlideView() {
        View.apply(this, arguments);
        _createBackground.call(this);
        var rootNode = _createCard.call(this);
        _createHandle.call(this, rootNode);
        //_setListeners.call(this);

    }

    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

    SlideView.DEFAULT_OPTIONS = {
        size: [window.innerWidth * 0.9, window.innerHeight * 0.75],
        photoUrl: SlideData.defaultImage,
        position: position
    };

    SlideView.prototype.fadeIn = function() {
        this.cardModifier.setOpacity(1, {
            duration: 100,
            curve: 'easeOut'
        });
    };


    function opacitateIn(duration) {
        opacityState.set(1, {
            duration: duration || 0
        })
    }

    function opacitateOut(duration) {
        opacityState.set(0, {
            duration: duration || 0
        })
    }

    function opacityToggle(duration) {
        var currentOpacity = opacityState.get();
        if (currentOpacity > 0.5) opacitateIn(duration);
        else opacitateOut(duration);
    }

    function _createHandle() {
        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
        });
        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        arguments[0]._object.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = this.options.position.get();
        
            this.options.position.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
            console.log(this.cardModifier);
            this.cardModifier.setOpacity(Math.abs(window.innerWidth / currentPosition[0]) / 10, {duration : 500});
        }.bind(this));

        sync.on('end', function(data) {
            var currentPosition = this.options.position.get();
            var velocity = data.velocity;
            // position.set([0, 0], {
            //     method: 'spring',
            //     period: 150,
            //     velocity: velocity
            // });
            if (currentPosition[0] < -window.innerWidth / 6) {
                // this._eventOutput.emit('swipeLeft0');
                this._eventOutput.emit('swipeLeft');
            } else if (currentPosition[0] > window.innerWidth / 6) {
                //this._eventOutput.emit('swipeRight0');
                this._eventOutput.emit('swipeRight');
            } else {
                this.options.position.set([0, 0], {
                    method: 'spring',
                    period: 150,
                    velocity: velocity
                });
            }
        }.bind(this));

        var positionModifier = new Modifier({
            transform: function() {
                var currentPosition = this.options.position.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0);
            }.bind(this)
        });

        var rotationModifier = new Modifier({
            transform: function() {
                var currentPosition = this.options.position.get();
                return Transform.rotateZ(-0.0015 * currentPosition[0]);
            }.bind(this)
        });

        this.add(positionModifier).add(rotationModifier).add(arguments[0]);
    }

    function _createBackground() {
        this.rootModifier = new StateModifier({
            size: this.options.size
        });

        this.mainNode = this.add(this.rootModifier);

        this.background = new Surface({
            // undefined size will inherit size from parent modifier
            properties: {
                backgroundColor: '#FFFFF5',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)'
            }
        });

        this.mainNode.add(this.background);

    }

    function _createCard() {
        var cardSizeX = this.options.size[0] - 2 * 5;
        var cardSizeY = this.options.size[1] - 2 * 5;
        var card = new ImageSurface({
            size: [cardSizeX, cardSizeY],
            content: this.options.photoUrl,
            properties: {
                zIndex: 2

            }
        });

        this.cardModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0],
            transform: Transform.translate(0, 5, 2),
        });

        return this.mainNode.add(this.cardModifier).add(card);
    }

    function _setListeners() {
        this.background.on('click', function() {
            // the event output handler is used to broadcast outwards
            this._eventOutput.emit('click');
        }.bind(this));
    }

    module.exports = SlideView;
});
