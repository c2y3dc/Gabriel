define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    function LoadingView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
    }

    LoadingView.prototype = Object.create(View.prototype);
    LoadingView.prototype.constructor = LoadingView;

    LoadingView.DEFAULT_OPTIONS = {
        width: window.innerWidth,
        height: window.innerHeight,
        size: [window.innerWidth * 0.9, window.innerHeight * 0.687],
        headerSize: window.innerHeight * 0.15,
        footerSize: window.innerHeight * 0.167
    };

    function _createBacking() {
        var backingSurface = new Surface({
            properties: {
                backgroundColor: '#FDFDFD'
            }
        });
        this.add(backingSurface);
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

        // this.bodySurface = new Surface({
        //     size: [undefined, undefined],
        //     classes: ['loader'],
        //     content: '<div class="loader"> </div>',
        //     properties: {
        //         backgroundColor: '#FDFDFD'
        //     }
        // });

        // this.bodyModifier = new StateModifier({
        //     transform: Transform.translate(0, 0, 201)
    }

    function _createHeader() {
        var headerSurface = new Surface({
            properties: {
                backgroundColor: '#F9F9F9',
                borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
            }
        });

        var headerModifier = new StateModifier({
            transform: Transform.inFront
        });
        this.layout.header.add(headerModifier).add(headerSurface);

        this.profileSurface = new ImageSurface({
            size: [20, 20],
            content: 'img/profile.svg'
        });

        this.titleSurface = new Surface({
            size: [true, 44],
            content: 'DISCOVERY',
            properties: {
                fontSize: this.options.width * 0.042 + 'px',
                color: 'rgba(0, 0, 0, 0.75)',
                fontWeight: 600
            }
        });

        var profileModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.07, this.options.headerSize * 0.18, 0),
            origin: [0, 0],
            align: [0, 0.5]
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(0, this.options.headerSize * 0.25, 0),
            origin: [0.5, 0],
            align: [0.5, 0.5]
        });

        this.layout.header.add(profileModifier).add(this.profileSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
    }

    function _createBody() {
        this.node = this.layout.content;

        this.cardSurface = new Surface({
            size: [window.innerWidth * 0.82, window.innerHeight * 0.687],
            properties: {
                backgroundColor: '#FAFAFA',
                border: '1px solid rgba(0, 0, 0, 0.125)',
                borderRadius: '8px'
            }
        });

        this.cardModifier = new StateModifier({
            transform: Transform.translate(0, this.options.height * 0.025, 0),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.loadingGif = new ImageSurface({
            size: [44, 44],
            content: 'img/loading.gif'
        });

        this.loadingModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        this.node.add(this.cardModifier).add(this.cardSurface);
        this.node.add(this.loadingModifier).add(this.loadingGif);
    }
    module.exports = LoadingView;
});
