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
        this.pageCount = 1;
        this.rootModifier = new StateModifier({
            size: this.options.size,
            transform: Transform.translate(0, this.options.height * 0.0444, 0),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);
        _createSlides.call(this, function() {});

        this.on('swipeItLeft', this.swipeLeft.bind(this));
        this.on('swipeItRight', this.swipeRight.bind(this));
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
        slideArrived: true,
        jobs: {},
        height: window.innerHeight,
        width: window.innerWidth,
        size: [window.innerWidth * 0.858, window.innerHeight * 0.688],
        lightboxOpts: {
            inTransform: Transform.translate(300, 0, 0),
            outTransform: Transform.translate(-50, 0, 0),
            inTransition: {
                duration: 250,
                curve: 'easeOut'
            },
            outTransition: {
                duration: 250,
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
            curve: 'easeOut',
            period: 800,
        });

        //OUR API CALL TO ARCHIVE GOES HERE

        //Saves current startup's id

        var sid = this.slides[this.currentIndex].options.job.startup.id;

        // //Archive POST REQ
        //console.log("startup_id", sid);

        ANGEL.post('/1/talent/pairing', {
            data: {
                startup_id: sid,
                // user_id: ME.id,
                user_interested: 0
            }
        }).done(function(data) {
            //console.log("Archive doneRes", data);
        }.bind(this)).fail(function(oops) {
            //console.log("already archive'd / unable to archive", oops);
        }.bind(this));

        //UNFOLLOWS POST REQ
        // ANGEL.del('/1/follows', {
        //     data: {
        //         type: 'startup',
        //         id: sid }
        //     }).done(function(data) {
        //         console.log(data, "you've unfollowed " + data.followed.name);
        //     }.bind(this)).fail(function(oops) {
        //         console.log('not yet followed / unable to unfollow');
        //     }.bind(this));

        this.showNextSlide(function() {
            this.options.slideArrived = true
        }.bind(this));

        slide.archiveFeedbackSurface.archiveMod.opacityFrom(1);

    };

    DeckView.prototype.swipeRight = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.options.outTransform = Transform.translate(0, 0, 0);
        this.lightbox.options.inTransform = Transform.translate(-500, 0, 0);
        slide.options.position.set([500, 0], {
            curve: 'easeOut',
            period: 800,
        });


        //THIS IS WHERE OUR API CALL TO CONNECT GOES

        //Saves current startup's id
        var sid = this.slides[this.currentIndex].options.job.startup.id;

        //console.log("startup_id", sid);

        // //Interested POST REQ
        ANGEL.post('/1/talent/pairing', {
            data: {
                startup_id: sid,
                // user_id: ME.id,
                user_note: "",
                user_interested: 1
            }
        }).done(function(data) {
            //console.log("Intro doneRes", data);
        }.bind(this)).fail(function(oops) {
            //console.log("already intro'd / unable to intro", oops);
        }.bind(this));

        //FOLLOWS POST REQ
        // ANGEL.post('/1/follows', {
        //     data: {
        //         type: 'startup',
        //         id: sid }
        //     }).done(function(data) {
        //         console.log(data, "you've followed " + data.followed.name);
        //     }.bind(this)).fail(function(oops) {
        //         console.log('already following / unable to follow');
        //     }.bind(this));
        // !!! DO NOT DELETE - WORKING POST REQUEST AWAITING ANGELLIST API TEAM RESPONSE!!!
        // this.options.angel.post('/1/intros', {
        //     data: {
        //         startup_id: sid }
        //     }).done(function(data) {
        //         console.log(data);
        //     }.bind(this)).fail(function(oops) {
        //         console.log('unable to post');
        //     }.bind(this));
        //this._eventOutput.emit('buttonToggle');

        this.showNextSlide(function() {
            this.options.slideArrived = true;
            this.options.okToFlip = true;
        }.bind(this));

        slide.interestedFeedbackSurface.interestedMod.opacityFrom(1);
    };

    DeckView.prototype.flip = function() {

        var slide = this.slides[this.currentIndex];
        var angle = slide.options.toggle ? 0 : -Math.PI;

        slide.flipper.setAngle(angle, {
            curve: 'easeOut',
            duration: 450,
        }, function() {
            slide.options.toggle = !slide.options.toggle;
        }.bind(this));
    }

    DeckView.prototype.showNextSlide = function(callback) {
        this.currentIndex++;
        if (this.currentIndex === Object.keys(this.slides).length) {
            this.currentIndex = 0;
        }

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
        for (var i = 0; i < Object.keys(this.options.jobs).length; i++) {
            var tags = this.options.jobs[i].tags;
            var skills = [];
            var location = [];

            tags.forEach(function(element) {
                if (element.tag_type === "SkillTag") {
                    skills.push(element.display_name);
                }
                if (element.tag_type === "LocationTag") {
                    location.push(element.display_name);
                }
            });

            var slide = new SlideView({
                size: this.options.size,
                job: this.options.jobs[i],
                logo_url: this.options.jobs[i].startup.logo_url,
                skills: skills,
                location: location
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
        // console.log('SLIDES ARRAY', this.slides);

        this.showNextSlide(function() {
            this._eventOutput.emit('firstSlideReady');
        }.bind(this));


    }


    module.exports = DeckView;
});
