define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var FastClick = require('famous/inputs/FastClick');

    var CardView = require('views/CardView');

    function PageView() {
        View.apply(this, arguments);
        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createFooter.call(this);
        _createBody.call(this);
        // _createCardView.call(this);

        _setListeners.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44,
        headerWidth: window.innerWidth,
        footerSize: 74,
        footerWithd: window.innerWidth
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
            transform: Transform.behind
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
            content: 'img/hamburger.png'
        });

        /*HEADER MODIFIERS */
        var hamburgerModifier = new StateModifier({
            origin: [0, 0.5],
            align: [0, 0.5]
        });

        var titleModifier = new StateModifier({
            origin: [0.5, 0],
            align: [0.5, 0.3]
        });

        var matchModifier = new StateModifier({
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

    // function _createCardView() {
    //   this.cardView = new CardView();
    //
    //
    //
    //   this.add(this.cardModifier).add(this.cardView);
    // }

    function _createBody() {
        var node = this.layout.content;

        this.bodySurface = new Surface({
          size: [undefined, undefined],
          classes: ['main-body-background']
        });

        this.bodyModifier = new StateModifier({
          transform: Transform.behind
        });

        this.cardView = new CardView();

        this.cardModifier = new Modifier({
          origin: [0.5, 0.5],
          align: [0.5, 0.5]
        });

        node.add(this.bodyModifier).add(this.bodySurface);
        node.add(this.cardModifier).add(this.cardView);
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
            this.noButtonModifier.setOpacity(0.5, { duration: 100 });
        }.bind(this));

        this.noButtonSurface.on('touchend', function() {
            this.noButtonModifier.setOpacity(1, { duration: 100 });
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));

        this.yesButtonSurface.on('touchstart', function() {
            this.yesButtonModifier.setOpacity(0.5, { duration: 100 });
        }.bind(this));

        this.yesButtonSurface.on('touchend', function() {
            this.yesButtonModifier.setOpacity(1, { duration: 100 });
            //this._eventOutput.emit('buttonToggle');
        }.bind(this));
    }



    module.exports = PageView;
});
