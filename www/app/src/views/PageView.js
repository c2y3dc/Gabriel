define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var FastClick       = require('famous/inputs/FastClick');

    function PageView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _setListeners.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44,
        headerWidth: window.innerWidth
    };

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize
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
            properties: {
                color: 'white'
            }
        });

        this.matchSurface = new ImageSurface({
            size: [44, 44],
            content: 'img/icon.png'
        });

        /*HEADER MODIFIERS */
        var hamburgerModifier = new StateModifier({
            origin: [0, 0.5],
            align : [0, 0.5]
        });

        var titleModifier = new StateModifier({
            origin: [0.5, 0],
            align : [0.5, 0.5]
        });

        var matchModifier = new StateModifier({
            origin: [1, 0.5],
            align : [1, 0.5]
        });

        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
        this.layout.header.add(matchModifier).add(this.matchSurface);
    }

    function _createBody() {
        this.bodySurface = new Surface({
            size : [undefined, undefined],
            classes : ['main-body-background']
        });

        this.layout.content.add(this.bodySurface);
    }

     function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }



    module.exports = PageView;
});