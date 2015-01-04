define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var FastClick = require('famous/inputs/FastClick');

    function AboutView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);

        _setListeners.call(this);
    }

    AboutView.prototype = Object.create(View.prototype);
    AboutView.prototype.constructor = AboutView;

    AboutView.DEFAULT_OPTIONS = {
        headerSize: window.innerHeight * 0.097,
        headerWidth: window.innerWidth
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'white'
            }
        });

        this.add(backing);
    }

    /**
     * _createLayout function: create basic header footer
     */
    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize,
            footerSize: this.options.headerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    /**
     * _createHeader function: create header of the page
     */
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

        // Header surfaces
        this.backSurface = new ImageSurface({
            size: [16, 16],
            content: 'img/back.png'
        });

        this.titleSurface = new Surface({
            size: [true, 44],
            content: 'About',
            properties: {
                color: 'white'
            }
        });

        // Header modifiers
        var backModifier = new StateModifier({
            transform: Transform.inFront,
            origin: [0, 0.5],
            align: [0, 0.5]
        })

        var titleModifier = new StateModifier({
            transform: Transform.inFront,
            origin: [0.5, 0],
            align: [0.5, 0.5]
        });

        this.layout.header.add(backModifier).add(this.backSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
    }

    function _createBody() {
        var node = this.layout.content;

        this.bodySurface = new Surface();

        this.bodyModifier = new StateModifier({
            transform: Transform.behind
        });

        node.add(this.bodyModifier).add(this.bodySurface);
    }

    function _setListeners() {
        this.backSurface.on('click', function() {
            this._eventOutput.emit('backToMenu');
        }.bind(this));
    }

    module.exports = AboutView;
});
