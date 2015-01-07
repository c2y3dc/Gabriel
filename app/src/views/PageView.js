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

    var DeckView = require('views/DeckView');

    function PageView() {
        View.apply(this, arguments);
        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createBody.call(this);
        _setListeners.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {

        initialData: {},
        width: window.innerWidth,
        height: window.innerHeight,
        jobs: undefined,
        headerSize: window.innerHeight * 0.1127,
        headerWidth: window.innerWidth,
        footerSize: window.innerHeight * 0.167,
        footerWidth: window.innerWidth,
        transition: {
            duration: 500,
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
            properties: {
                backgroundColor: '#1976D2'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.inFront
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);

        /*HEADER SURFACES*/
        this.menuSurface = new ImageSurface({
            size: [20, 20],
            content: 'img/menu.svg'
        });

        this.titleSurface = new Surface({
            size: [true, 44],
            content: 'Gabriel',
            properties: {
                fontSize: '18px',
                color: 'white'
            }
        });

        this.matchSurface = new ImageSurface({
            size: [25, 18],
            content: 'img/matches.svg'
        });

        /*HEADER MODIFIERS */
        var menuModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.07, this.options.headerSize * 0.18, 100),
            origin: [0, 0],
            align: [0, 0.5]
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(0, this.options.headerSize * 0.18, 100),
            origin: [0.5, 0],
            align: [0.5, 0.5]
        });

        var matchModifier = new StateModifier({
            // transform: Transform.inFront,
            transform: Transform.translate(-this.options.width * 0.087, this.options.headerSize * 0.18, 100),
            origin: [1, 0],
            align: [1, 0.5]
        });

        this.layout.header.add(menuModifier).add(this.menuSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
        this.layout.header.add(matchModifier).add(this.matchSurface);
    }

    function _createFooter() {
        var backgroundSurface = new Surface({
            properties: {
                backgroundColor: '#FDFDFD'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        this.layout.footer.add(backgroundModifier).add(backgroundSurface);

        /*HEADER SURFACES*/
        this.archiveSurface = new Surface({
            size: [this.options.width * 0.406, this.options.height * 0.0722],
            content: 'Archive',
            properties: {
                textTransform: 'uppercase',
                textAlign: 'center',
                backgroundColor: '#B6B6B6',
                boxShadow: '0 px 2 px 4 px 0 px rgba(0, 0, 0, 0.30)',
                borderRadius: '2px',
                fontSize: '14px',
                color: '#FFFFFF',
                letterSpacing: '1px',
                lineHeight: this.options.height * 0.0722 + 'px'
            }
        });

        this.interestedSurface = new Surface({
            size: [window.innerWidth / 2 - window.innerWidth / 14, 44],
            content: 'Interested',
            properties: {
                textTransform: 'uppercase',
                textAlign: 'center',
                backgroundColor: '#2196F3',
                boxShadow: '0 px 2 px 4 px 0 px rgba(0, 0, 0, 0.30)',
                borderRadius: '2px',
                fontSize: '14px',
                color: '#FFFFFF',
                letterSpacing: '1px',
                lineHeight: this.options.height * 0.0722 + 'px'
            }
        });

        /*HEADER MODIFIERS */
        this.archiveModifier = new Modifier({
            opacity: 1,
            origin: [0, 0.5],
            align: [0.05, 0.5]
        });

        this.interestedModifier = new Modifier({
            opacity: 1,
            origin: [1, 0.5],
            align: [0.95, 0.5]
        });

        this.layout.footer.add(this.archiveModifier).add(this.archiveSurface);
        this.layout.footer.add(this.interestedModifier).add(this.interestedSurface);
    }

    function _createBody() {
        this.node = this.layout.content;

        this.bodySurface = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FDFDFD'
            }
        });
        this.bodyModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });
        // this.node.add(this.bodyModifier).add(this.bodySurface);
        _createDeckView.call(this);

    }

    function _createDeckView() {
        this.deckView = new DeckView({
            initialData: this.options.initialData
        });

        this.deckModifier = new StateModifier({
            transform: Transform.translate(0, 0, 100)
        });

        this.node.add(this.deckModifier).add(this.deckView);
    }

    function _setListeners() {

        this.menuSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.matchSurface.on('click', function() {
            console.log('matchView is clicked');
            this._eventOutput.emit('matchOnly');
        }.bind(this));

        this.archiveSurface.on('touchstart', function() {
            this.archiveModifier.setOpacity(0.5, {
                duration: 10
            });
        }.bind(this));

        this.archiveSurface.on('touchend', function() {
            this.archiveModifier.setOpacity(1, {
                duration: 10
            });
            if (this.deckView.options.slideArrived) {
                this.deckView.options.slideArrived = false;
                this.deckView._eventOutput.emit('swipeLeft');
            }
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));

        this.interestedSurface.on('touchstart', function() {
            this.interestedModifier.setOpacity(0.5, {
                duration: 10
            });
        }.bind(this));

        this.interestedSurface.on('touchend', function() {
            this.interestedModifier.setOpacity(1, {
                duration: 10
            });
            if (this.deckView.options.slideArrived) {
                this.deckView.options.slideArrived = false;
                this.deckView._eventOutput.emit('swipeRight');
            }
        }.bind(this));
    }

    module.exports = PageView;
});
