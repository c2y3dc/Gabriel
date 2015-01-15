define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var ProgressBar = require('progressbar');


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
        headerSize: window.innerHeight * 0.1127,
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
    }

    function _createHeader() {
        var headerSurface = new Surface({
          classes: ['testing'],
            properties: {
                background: 'url("img/grey.png") repeat top right',
                backgroundColor: '#F9F9F9',
                borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
            }
        });

        var headerModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0, this.options.height * 0.04, 0.9)
        });

        this.layout.header.add(headerModifier).add(headerSurface);

        this.profileSurface = new ImageSurface({
            size: [21, 21],
            content: 'img/profile.svg'
        });

        this.titleSurface = new Surface({
            size: [true, 44],
            content: 'GABRIEL',
            properties: {
                fontSize: this.options.width * 0.03875 + 'px',
                color: 'rgba(0, 0, 0, 0.6)',
                letterSpacing: '-0.275px',
                fontWeight: 400
            }
        });

        var profileModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.095, this.options.height * 0.095, 0.9)
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.4275, this.options.height * 0.10875, 0.9)
        });

        this.layout.header.add(profileModifier).add(this.profileSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
    }

    function _createBody() {
        this.node = this.layout.content;

        this.cardSurface = new Surface({
            size: [window.innerWidth * 0.82, window.innerHeight * 0.65],
            properties: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px dotted rgba(0, 0, 0, 0.125)',
                borderRadius: '8px'
            },
            content: [
            '<div class="loading_card">',
            '<div class="loading_top">',
            '<div class="loading_img"></div>',
            '<p class="loading_startup_name"><br></p>',
            '<p class="loading_high_concept"><br></p>',
            '</div>',
            '<div class="loading_divider">', '</div>',
            '<div id="loadingJobInfo">',
            '<p class="loading_job_title"></p>',
            '<p class="loading_location"><br></p>',
            '<p class="loading_location_description"><br></p>',
            '<p class="loading_skills"><br></p>',
            '<p class="loading_skills_description1"><br></p>',
            '<p class="loading_skills_description2"><br></p>',
            '</div>',
            '<div class="loading_bottom">',
            '<p class="loading_text">Loading Text</p>',
            '<div class="loading_bar">Loading Bar</div>',
            '</div>',
            ].join('')
        });

        this.cardModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.09, this.options.height * 0.0625, 0)
        });

        this.loadingGif = new ImageSurface({
            size: [44, 44],
            content: 'img/loading.gif'
        });

        // var progressBar = new ProgressBar.Square('#container', {
        //   strokeWidth: 2,
        //   color: '#fcb03c'
        // });
        // progressBar.animate(1);

        this.loadingModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        this.node.add(this.cardModifier).add(this.cardSurface);
    }
    module.exports = LoadingView;
});
