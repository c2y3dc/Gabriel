define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var SlideView = require('views/SlideView');
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);



    function DeckView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            size: this.options.size,
            transform: Transform.translate(0, this.options.height * 0.0264, 0),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);
        _createSlides.call(this);

        this.on('swipeLeft', this.swipeLeft.bind(this));
        this.on('swipeRight', this.swipeRight.bind(this));
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
        height: window.innerHeight,
        width: window.innerWidth,
        size: [window.innerWidth * 0.9, window.innerHeight * 0.687],
        jobs: undefined,
        lightboxOpts: {
            // inOpacity: 1,
            // outOpacity: 0,
            // inTransform: Transform.translate(window.innerWidth, 0, 0),
            // outTransform: Transform.translate(-window.innerWidth * 2, 0, 0),
            inTransition: {
                duration: 0,
                curve: 'easeOut'
            },
            outTransition: {
                duration: 0,
                curve: Easing.inCubic
            }
        }
    };

    DeckView.prototype.showCurrentSlide = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide);
        // this.lightbox.show(slide, function() {
        //     slide.fadeIn();
        // }.bind(this));
    };
    DeckView.prototype.swipeLeft = function() {
        var slide = this.slides[this.currentIndex];
        slide.options.position.set([-500, 0], {
            method: 'spring',
            period: 150,
        });

        //OUR API CALL TO ARCHIVE GOES HERE
        this.showNextSlide();
    };

    DeckView.prototype.flip = function() {
        var slide = this.slides[this.currentIndex];
        var angle = slide.options.toggle ? 0 : Math.PI;
        slide.flipper.setAngle(angle, {
            curve: 'easeOut',
            duration: 1200
        });
        slide.options.toggle = !slide.options.toggle;
    }

    DeckView.prototype.swipeRight = function() {
        var slide = this.slides[this.currentIndex];
        slide.options.position.set([500, 0], {
            method: 'spring',
            period: 150,
        });

        //THIS IS WHERE OUR API CALL TO CONNECT GOES
        this.showNextSlide();
    };

    DeckView.prototype.showNextSlide = function() {
        this.currentIndex++;
        if (this.currentIndex === this.slides.length) this.currentIndex = 0;
        this.slides[this.currentIndex].options.position.set([0, 0]);
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide);
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);
    }

    function _createSlides() {
        this.slides = [];
        this.currentIndex = 0;

        for (var i = 0; i < this.options.jobs.length; i++) {
            var slide = new SlideView({
                size: this.options.size,
                job: this.options.jobs[i],
            });

            this.slides.push(slide);

            // adding click listener
            // on click, calling .showNextSlide()
            // note that we're binding showNextSlide to the slideshow
            // to maintain the correct context when called
            slide.on('swipeRight', this.swipeRight.bind(this));
            slide.on('swipeLeft', this.swipeLeft.bind(this));
            slide.on('flip', this.flip.bind(this));
        }

        this.showNextSlide();
    }

    module.exports = DeckView;
});
