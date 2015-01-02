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
        'touch': TouchSync
    });

    var position1 = new Transitionable([0, 0]);
    var position2 = new Transitionable([0, 0]);
    var position3 = new Transitionable([0, 0]);

    function PageView() {
        View.apply(this, arguments);
        //this.swipeToggle = false;
        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createBody.call(this);
        _handleDrags.call(this);
        _setListeners.call(this);

    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44,
        headerWidth: window.innerWidth,
        footerSize: 74,
        footerWithd: window.innerWidth,
        cardOffset: 5,
        slideY: window.innerHeight * 2,
        slideX: window.innerWidth * 2,
        transition: {
            duration: 500,
            curve: 'easeOut'
        }
    };

    PageView.prototype.toggleSwipe = function() {
        if (this.swipeToggle) {
            this.swipeLeft();
        } else {
            this.swipeRight();
        }
        this.swipeToggle = !this.swipeToggle;
    };

    PageView.prototype.swipeRight = function() {
        var cardNumber = arguments[0];
        this.cardModifiers[cardNumber].setTransform(Transform.translate(this.options.slideX, this.options.slideY, 0), this.options.transition);
    };

    PageView.prototype.swipeLeft = function() {
        var cardNumber = arguments[0];
        this.cardModifiers[cardNumber].setTransform(Transform.translate(-this.options.slideX, this.options.slideY, 0), this.options.transition);
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
            contentSize: undefined,
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

        var sendModifier = new StateModifier({
            transform: Transform.inFront,
            origin: [1, 0.5],
            align: [1, 0.5]
        });

        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
        this.layout.header.add(sendModifier).add(this.sendSurface);
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

        for (var i = 0; i < 3; i++) {

            this.noButtonSurface.on('click', function() {
                this._eventOutput.emit('menuViewToggle');
            }.bind(this));

            this.yesButtonSurface.on('click', function() {
                this._eventOutput.emit('settingsViewToggle');
            }.bind(this));

            this.cardView = new CardView();

            this.cardViews.push(this.cardView);

            this.cardModifier = new Modifier({
                origin: [0.5, 0.5],
                align: [0.5, 0.5]
            });

            this.scaleModifier = new StateModifier({
                transform: Transform.scale(1 - xOffScale, 1 - yOffScale, 1)
            });

            this.cardModifiers.push(this.cardModifier);

            this.node.add(this.scaleModifier)
                .add(this.cardModifier)
                .add(this.cardView);

            xOffScale += 0.009;
            yOffScale += 0.009;
            this.cardView.backgroundSurface.content = i;
        }
    }

    function _handleDrags() {
        _handleDrag.call(this);
        _handleDrag1.call(this);
        _handleDrag2.call(this);
    }

    function _handleDrag() {
        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
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
            var currentPosition = position1.get();
            var velocity = data.velocity;
            if (currentPosition[0] < -window.innerWidth / 6) {
                this._eventOutput.emit('swipeLeft0');
            } else if (currentPosition[0] > window.innerWidth / 6) {
                this._eventOutput.emit('swipeRight0');
            } else {
                position1.set([0, 0], {
                    method: 'spring',
                    period: 150,
                    velocity: velocity
                });
            }
        }.bind(this));

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
            var currentPosition = position2.get();
            var velocity = data.velocity;
            if (currentPosition[0] < -window.innerWidth / 6) {
                this._eventOutput.emit('swipeLeft1');
            } else if (currentPosition[0] > window.innerWidth / 6) {
                this._eventOutput.emit('swipeRight1');
            } else {
                position2.set([0, 0], {
                    method: 'spring',
                    period: 150,
                    velocity: velocity
                });
            }
        }.bind(this));

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
        });

        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.cardViews[2].backgroundSurface.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = position3.get();
            position3.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
            //console.log(currentPosition);
        });
        sync.on('end', function(data) {
            var currentPosition = position3.get();
            var velocity = data.velocity;
            if (currentPosition[0] < -window.innerWidth / 6) {
                this._eventOutput.emit('swipeLeft2');
            } else if (currentPosition[0] > window.innerWidth / 6) {
                this._eventOutput.emit('swipeRight2');
            } else {
                position3.set([0, 0], {
                    method: 'spring',
                    period: 150,
                    velocity: velocity
                });
            }
        }.bind(this));

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

        this.on('swipeRight0', this.swipeRight.bind(this, 0));
        this.on('swipeRight1', this.swipeRight.bind(this, 1));
        this.on('swipeRight2', this.swipeRight.bind(this, 2));
        this.on('swipeLeft0', this.swipeLeft.bind(this, 0));
        this.on('swipeLeft1', this.swipeLeft.bind(this, 1));
        this.on('swipeLeft2', this.swipeLeft.bind(this, 2));

        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));


        this.matchSurface.on('click', function() {
            this._eventOutput.emit('matchViewToggle');
        }.bind(this));

        // this.noButtonSurface.on('click', function() {
        //     this._eventOutput.emit('menuToggle');
        // }.bind(this));

        // this.yesButtonSurface.on('click', function() {
        //     this._eventOutput.emit('menuToggle');
        // }.bind(this));

        this.noButtonSurface.on('touchstart', function() {
            this.noButtonModifier.setOpacity(0.5, {
                duration: 100
            });
        }.bind(this));

        this.noButtonSurface.on('touchend', function() {
            this.noButtonModifier.setOpacity(1, {
                duration: 100
            });
            this._eventOutput.emit('swipeLeft2');
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
            this._eventOutput.emit('swipeRight2');
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));
    }


    module.exports = PageView;
});
