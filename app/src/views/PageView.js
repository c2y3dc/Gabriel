define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    //var FastClick = require('famous/inputs/FastClick');
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

        jobs: {},
        width: window.innerWidth,
        height: window.innerHeight,
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
                backgroundColor: 'rgba(250, 250, 250, 0.15)'
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
                background: 'url("img/grey.png") repeat top right',
                backgroundColor: '#F9F9F9',
                opacity: 0.95,
                borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
            }
        });

        var backgroundModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.9)
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);

        /*HEADER SURFACES*/
        this.profileSurface = new ImageSurface({
            size: [23, 23],
            content: 'img/profile.svg'
        });

        this.titleSurface = new Surface({
            size: [true, 44],
            content: 'GABRIEL',
            properties: {
                fontSize: this.options.width * 0.042 + 'px',
                color: 'rgba(0, 0, 0, 0.75)',
                fontWeight: 400
            }
        });

        /*HEADER MODIFIERS */
        var profileModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.05, this.options.height * 0.05, 0.9)
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.42, this.options.height * 0.065, 0.9)
        });

        this.layout.header.add(profileModifier).add(this.profileSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
    }

    function _createFooter() {
        var backgroundSurface = new Surface();

        var backgroundModifier = new StateModifier({
            transform: Transform.behind
        });

        this.layout.footer.add(backgroundModifier).add(backgroundSurface);

        /*HEADER SURFACES*/
        this.archiveSurface = new Surface({
            size: [this.options.width * 0.4141, this.options.height * 0.085],
            content: 'Archive',
            properties: {
                textTransform: 'uppercase',
                textAlign: 'center',
                borderRadius: '4px',
                border: '2px solid #8F8F8F',
                fontSize: '14px',
                color: '#8F8F8F',
                letterSpacing: '1px',
                fontWeight: 600,
                lineHeight: this.options.height * 0.083 + 'px'
            }
        });

        this.interestedSurface = new Surface({
            size: [this.options.width * 0.4141, this.options.height * 0.085],
            content: 'Interested',
            properties: {
                textTransform: 'uppercase',
                textAlign: 'center',
                backgroundColor: '#34C9AB',
                border: '2px solid #34C9AB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#FFFFFF',
                letterSpacing: '1px',
                fontWeight: 600,
                lineHeight: this.options.height * 0.083 + 'px'
            }
        });

        /*HEADER MODIFIERS */
        this.archiveModifier = new Modifier({
            transform: Transform.translate(0, this.options.height * 0.016, 0),
            origin: [0, 0.5],
            align: [0.05, 0.5]
        });

        this.interestedModifier = new Modifier({
            transform: Transform.translate(0, this.options.height * 0.016, 0),
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
        _createDeckView.call(this);

    }

    function _createDeckView() {
        this.deckView = new DeckView({
            jobs: this.options.jobs
        });

        this.deckModifier = new StateModifier({
            transform: Transform.translate(0, 0, 100)
        });

        this.node.add(this.deckModifier).add(this.deckView);
    }

    function _setListeners() {

        this.deckView.on('firstSlideReady', function() {
            this._eventOutput.emit('firstSlideReady');
        }.bind(this));

        // this.profileSurface.on('click', function(e) {
        //     if (e.detail !== null) return false;
        // }.bind(this));

        this.profileSurface.on('touchstart', function() {
            this._eventOutput.emit('menuToggle');
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
                this.deckView._eventOutput.emit('swipeItLeft');
            }
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
                this.deckView._eventOutput.emit('swipeItRight');
            }
        }.bind(this));
    }

    module.exports = PageView;
});
