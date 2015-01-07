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
    var ImageSurface = require('famous/surfaces/ImageSurface');
    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);



    function DeckView() {
        View.apply(this, arguments);
        this.rootModifier = new StateModifier({
            size: this.options.size,
            transform: Transform.translate(0, this.options.height * 0.0444, 0),
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
        slideArrived: true,
        initialData: {},
        height: window.innerHeight,
        width: window.innerWidth,
        size: [window.innerWidth * 0.858, window.innerHeight * 0.688],
        jobs: undefined,
        lightboxOpts: {
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-500, 0, 0),
            inTransition: {
                duration: 500,
                curve: Easing.outBack
            },
            outTransition: {
                duration: 350,
                curve: Easing.inQuad
            }
        }
    };

    DeckView.prototype.showCurrentSlide = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide);
    };

    DeckView.prototype.swipeLeft = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.options.outTransform = Transform.translate(-500, 0, 0);
        this.lightbox.options.inTransform = Transform.translate(300, 0, 0);
        slide.options.position.set([-500, 0], {
            method: 'spring',
            period: 600,
        });

        //OUR API CALL TO ARCHIVE GOES HERE
        this.showNextSlide(function() {
            this.options.slideArrived = true
        }.bind(this));
    };

    DeckView.prototype.swipeRight = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.options.outTransform = Transform.translate(500, 0, 0);
        this.lightbox.options.inTransform = Transform.translate(-300, 0, 0);
        slide.options.position.set([500, 0], {
            method: 'spring',
            period: 600,
        });
        //THIS IS WHERE OUR API CALL TO CONNECT GOES
        this.showNextSlide(function() {
            this.options.slideArrived = true;
            this.options.okToFlip = true;
        }.bind(this));
    };

    DeckView.prototype.flip = function() {
        var slide = this.slides[this.currentIndex];
        var angle = slide.options.toggle ? 0 : -Math.PI;
        slide.flipper.setAngle(angle, {
            curve: Easing.outBack,
            duration: 550,
            period: 250
        }, function() {
            slide.options.toggle = !slide.options.toggle;
        }.bind(this));
    }



    DeckView.prototype.showNextSlide = function(callback) {
        this.currentIndex++;
        if (this.currentIndex === Object.keys(this.slides).length) this.currentIndex = 0;
        this.slides[this.currentIndex].options.position.set([0, 0]);
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide, callback);
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);
    }

    function _createSlides() {
        this.slides = {};
        this.currentIndex = 0;
        console.log(this.options.initialData.jobs.length);
        for (var i = 0; i < this.options.initialData.jobs.length; i++) {
            var slide = new SlideView({
                size: this.options.size,
                job: this.options.initialData.jobs[i],
                logo_url: this.options.initialData.jobs[i].startup.logo_url
            });

            this.slides[i] = slide;
            // adding click listener
            // on click, calling .showNextSlide()
            // note that we're binding showNextSlide to the slideshow
            // to maintain the correct context when called
            slide.on('swipeRight', this.swipeRight.bind(this));
            slide.on('swipeLeft', this.swipeLeft.bind(this));
            slide.on('flip', this.flip.bind(this));
            slide.on('touchstart', function() {
                this.options.slideArrived = !this.options.slideArrived;
            }.bind(this));
            slide.on('touchend', function() {
               this.options.slideArrived = !this.options.slideArrived;
            }.bind(this));
        }

        this.showNextSlide();
    }

    module.exports = DeckView;
});
