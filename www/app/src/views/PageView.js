define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var FastClick = require('famous/inputs/FastClick');

    var ScrollSync = require("famous/inputs/ScrollSync");
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.registerMethod('spring', SnapTransition);

    var CardView = require('views/CardView');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync,
        "scroll": ScrollSync
    });

    var position1 = new Transitionable([0, 0]);
    var position2 = new Transitionable([0, 0]);
    var position3 = new Transitionable([0, 0]);
    var positions = [position1, position2, position3];

    function PageView() {
        View.apply(this, arguments);
        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createBody.call(this);
        _handleDrag.call(this);
        _handleDrag1.call(this);
        _handleDrag2.call(this);
        _setListeners.call(this);

    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44,
        headerWidth: window.innerWidth,
        footerSize: 74,
        footerWithd: window.innerWidth,
        cardOffset: 5
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
            content: 'Gabriel',
            classes: ['header-title']
        });

        this.matchSurface = new ImageSurface({
            size: [44, 44],
            content: 'img/match.png'
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

        var matchModifier = new StateModifier({
            transform: Transform.inFront,
            origin: [1, 0.5],
            align: [1, 0.5]
        });

        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
        this.layout.header.add(matchModifier).add(this.matchSurface);
    }

    function _createFooter() {
        var backgroundSurface = new Surface({
            classes: ['ionic-footer-background']
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        this.layout.footer.add(backgroundModifier).add(backgroundSurface);

        /*HEADER SURFACES*/
        this.noButtonSurface = new Surface({
            size: [window.innerWidth / 2 - window.innerWidth / 14, 44],
            content: 'Not Interested',
            classes: ['no-button']
        });

        this.yesButtonSurface = new Surface({
            size: [window.innerWidth / 2 - window.innerWidth / 14, 44],
            content: 'Interested',
            classes: ['yes-button']
        });

        /*HEADER MODIFIERS */
        this.noButtonModifier = new Modifier({
            opacity: 1,
            origin: [0, 0.5],
            align: [0.05, 0.5]
        });

        this.yesButtonModifier = new Modifier({
            opacity: 1,
            origin: [1, 0.5],
            align: [0.95, 0.5]
        });

        this.layout.footer.add(this.noButtonModifier).add(this.noButtonSurface);
        this.layout.footer.add(this.yesButtonModifier).add(this.yesButtonSurface);
    }

    function _createBody() {
        this.node = this.layout.content;

        this.bodySurface = new Surface({
            size: [undefined, undefined],
            classes: ['main-body-background']
        });

        this.bodyModifier = new StateModifier({
            transform: Transform.behind
        });

        this.node.add(this.bodyModifier).add(this.bodySurface);

        _createCardDeck.call(this);
    }

    function _createCardDeck() {
        this.cardViews = [];
        this.cardModifiers = [];
        var yOffScale = 0;
        var xOffScale = 0;

        for (var i = 0; i <= 2; i++) {

            this.cardView = new CardView();

            this.cardViews.push(this.cardView);

            this.cardModifier = new Modifier({
                origin: [0.5, 0.5],
                align: [0.5, 0.5]
            });

            this.yOffsetModifier = new StateModifier({
                transform: Transform.translate(0, 0, 0)
            });

            this.scaleModifier = new StateModifier({
                transform: Transform.scale(1 - xOffScale, 1 - yOffScale, 1)
            })

            this.cardModifiers.push(this.yOffsetModifier);

            this.node.add(this.scaleModifier)
                //.add(this.yOffsetModifier)
                .add(this.cardModifier)
                .add(this.cardView);

            xOffScale += 0.009;
            yOffScale += 0.009;
            this.cardView.backgroundSurface.content = i;
        }
    }

    function _handleDrag() {

        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
            "scroll": {
                scale: .5
            }
        });

        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.cardViews[0].backgroundSurface.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = position1.get();
            position1.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
        });

        sync.on('end', function(data) {
            var velocity = data.velocity;
            position1.set([0, 0], {
                method: 'spring',
                period: 150,
                velocity: velocity
            });
        });

        var positionModifier = new Modifier({
            transform: function() {
                var currentPosition = position1.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0);
            }
        });

        var rotationModifier = new Modifier({
            transform: function() {
                var currentPosition = position1.get();
                return Transform.rotateZ(-0.0015 * currentPosition[0]);
            }
        });
        var moveableNodes = this.cardViews[0].add(positionModifier).add(rotationModifier).add(this.cardViews[0].backgroundSurface);
    }

    function _handleDrag1() {

        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
            "scroll": {
                scale: .5
            }
        });

        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.cardViews[1].backgroundSurface.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = position2.get();
            position2.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
        });

        sync.on('end', function(data) {
            var velocity = data.velocity;
            position2.set([0, 0], {
                method: 'spring',
                period: 150,
                velocity: velocity
            });
        });

        var positionModifier = new Modifier({
            transform: function() {
                var currentPosition = position2.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0);
            }
        });

        var rotationModifier = new Modifier({
            transform: function() {
                var currentPosition = position2.get();
                return Transform.rotateZ(-0.0015 * currentPosition[0]);
            }
        });
        var moveableNodes = this.cardViews[1].add(positionModifier).add(rotationModifier).add(this.cardViews[1].backgroundSurface);
    }


    function _handleDrag2() {

        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
            "scroll": {
                scale: .5
            }
        });

        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.cardViews[2].backgroundSurface.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = position3.get();
            position3.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
        });

        sync.on('end', function(data) {
            var velocity = data.velocity;
            position3.set([0, 0], {
                method: 'spring',
                period: 150,
                velocity: velocity
            });
        });

        var positionModifier = new Modifier({
            transform: function() {
                var currentPosition = position3.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0);
            }
        });

        var rotationModifier = new Modifier({
            transform: function() {
                var currentPosition = position3.get();
                return Transform.rotateZ(-0.0015 * currentPosition[0]);
            }
        });
        var moveableNodes = this.cardViews[2].add(positionModifier).add(rotationModifier).add(this.cardViews[2].backgroundSurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.matchSurface.on('click', function() {
            this._eventOutput.emit('matchViewToggle');
        }.bind(this));

        this.noButtonSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.yesButtonSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.noButtonSurface.on('touchstart', function() {
            this.noButtonModifier.setOpacity(0.5, {
                duration: 100
            });
        }.bind(this));

        this.noButtonSurface.on('touchend', function() {
            this.noButtonModifier.setOpacity(1, {
                duration: 100
            });
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));

        this.yesButtonSurface.on('touchstart', function() {
            this.yesButtonModifier.setOpacity(0.5, {
                duration: 100
            });
        }.bind(this));

        this.yesButtonSurface.on('touchend', function() {
            this.yesButtonModifier.setOpacity(1, {
                duration: 100
            });
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));
    }


    module.exports = PageView;
});
