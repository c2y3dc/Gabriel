define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var SlideData = require('data/SlideData');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Flipper = require("famous/views/Flipper");
    var Scrollview = require("famous/views/Scrollview");
    var Easing = require('famous/transitions/Easing');

    var ScrollSync = require("famous/inputs/ScrollSync");
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.registerMethod('spring', SnapTransition);
   
    
    require('helpers/methods');


    // runs once for each new instance
    function SlideView() {
        // this.helperMethod = new Helper();
        View.apply(this, arguments);
        this.options.position = new Transitionable([0, 0]);
        this.rootModifier = new StateModifier({
            align: [.5, .5],
            origin: [.5, .5],
            transform: Transform.translate(0, 0, 0.9)
        });

        this.cardModifier = new StateModifier({
            align: [.5, .5],
            origin: [.5, .5],
            transform: Transform.translate(0, 0, 0.9)
        });

        this.mainNode = this.add(this.rootModifier);
        this.cardNode = this.mainNode.add(this.cardModifier);
        //_createBackground.call(this);
        _createFlipper.call(this);
        //var rootNode = _createCard.call(this);
        _createHandle.call(this);
        //_createShadowBox.call(this);
        _setListeners.call(this);

    }

    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

    SlideView.DEFAULT_OPTIONS = {
        width: window.innerWidth,
        height: window.innerHeight,
        size: [window.innerWidth * 0.9, window.innerHeight * 0.687],
        job: {},
        position: undefined,
        angle: undefined,
        toggle: false,
        jobDescription: 'No description provided',
        logo_url: undefined,
        skills: 'JavaScript, HTML, CSS, MongoDB, Famo.us, AngularJS, Sass',
        startup_location: 'San Francisco, CA',
        salary_min: '100k',
        salary_max: '150k',
        job_type: 'Full Time'
    };

    // SlideView.prototype.fadeIn = function() {

    //     this.shadowBox.setProperties({
    //         pointerEvents: 'auto'
    //     });

    //     this.cardModifier.setTransform(

    //         Transform.translate(0, 0, 350), {
    //             duration: 200,
    //             curve: Easing.easeOut
    //         }
    //     );
    //     this.cardModifier.setTransform(
    //         Transform.translate(0, 0, 1.5), {
    //             duration: 200,
    //             curve: Easing.easeIn
    //         }
    //     );

    //     this.shadowModifier.setOpacity(0.85, {
    //         duration: 1500,
    //         curve: 'easeOut'
    //     });
    // };

    // SlideView.prototype.fadeOut = function() {

    //     this.cardModifier.setTransform(
    //         Transform.translate(0, 0, 350), {
    //             duration: 200,
    //             curve: Easing.easeOut
    //         }
    //     );
    //     this.cardModifier.setTransform(
    //         Transform.translate(0, 0, 1.5), {
    //             duration: 200,
    //             curve: Easing.easeIn
    //         }
    //     );

    //     this.shadowModifier.setOpacity(0, {
    //         duration: 1500,
    //         curve: 'easeOut'
    //     });
    // };

    function _createFlipper() {
        this.flipper = new Flipper();
        _createCardFront.call(this);
        _createCardBack.call(this);

        this.flipper.setFront(this.frontNode);
        this.flipper.setBack(this.backSurface);

        this.cardNode.add(this.flipper);
    }

    function _createCardFront() {
        this.frontSurfaceModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.9)
        });

        this.frontNode = this.cardNode.add(this.frontSurfaceModifier);

        this.frontSurface = new Surface({
            size: this.options.size,
            classes: ['front-card'],
            properties: {
                fontSize: fontReSize(this.options.job.title.length)
            },
            content: [
                '<div class="card_header">',
                '<img class="logo_url" src="', this.options.job.startup.logo_url, '">',
                '<p class="startup_name">', this.options.job.startup.name, '</p>',
                '<p class="high_concept">', truncate(this.options.job.startup.high_concept, 120), '</p>',
                '</div>',
                '<div class="divider">', '</div>',
                '<div id="jobInfo">',
                '<span class="job_title">', capitalizeFirst(this.options.job.title), '</span>',
                '<p class="location">', '<span class="secondary-text">Location</span><br>', this.options.location, '</p>',
                '<p class="skills">', '<span class="secondary-text">Skills</span><br>', jobTags(this.options.skills, 6), '</p>',
                '<p class="compensation">', '<span class="secondary-text">Compensation</span><br>',
                capitalizeFirst(this.options.job.job_type), '<br>',
                salaryFormat(this.options.job.salary_min, this.options.job.salary_max), '<br>',
                equityFormat(this.options.job.equity_min, this.options.job.equity_max),
                '</p>',
                '</div>'
            ].join('')
        });

        this.frontNode.add(this.frontSurface);


        // this.flipForwardButton = new ImageSurface({
        //     size: [this.options.width * 0.07, this.options.width * 0.12],
        //     content: 'img/flip.svg'
        // });


        // this.flipModifier = new StateModifier({
        //     transform: Transform.translate(this.options.width * 0.395, this.options.height * 0, 0.9)
        // });

        // this.frontNode.add(this.flipModifier).add(this.flipForwardButton);


        // this.companyBackgroundSurface = new ImageSurface({
        //   size: [this.options.width * 0.9, this.options.height * 0.222],
        //   content: 'img/companybg.png'
        // });

        // this.companyBackgroundModifier = new StateModifier({
        //   transform: Transform.translate(0, -this.options.height * 0.23, 0.9)
        // });

        //this.frontNode.add(this.companyBackgroundModifier).add(this.companyBackgroundSurface);

        // this.companyLogoSurface = new ImageSurface({
        //   size: [this.options.width * 0.1875, this.options.width * 0.1875],
        //   content: this.options.logo_url,
        //   properties: {
        //     backgroundColor: '#FFFFFF',
        //     borderRadius: '2px',
        //     border: '3px solid #FFFFFF',
        //     boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.30)'
        //   }
        // });

        // this.companyLogoModifier = new StateModifier({
        //   transform: Transform.translate(this.options.width * 0.32, -this.options.height * 0.27, 0.8)
        // });


        // //this.frontNode.add(jobTitleModifier).add(jobTitleSurface);
        // this.frontNode.add(this.companyLogoModifier).add(this.companyLogoSurface);
        //this.frontNode.add(jobLocationModifier).add(jobLocationSurface);

        //this.frontNode.add(this.flipModifier).add(this.flipForwardButton);

    }

    function _createCardBack() {


            var content = this.options.job.description.slice();
            if (content.length===0) content = 'No Description Provided';


        // descParser = function() {
        //     var textString = this.options.job.description.slice();

        //     console.log(textString);
        //     var spaceCount = 0;
        //     var lastIndex = 0;
        //     for (var i=0; i<textString.length; i++){
        //         if (spaceCount > 1) {
        //             var paragraph = '<p>' + textString.slice(lastIndex, i) + '</p>';
        //             content = content + paragraph;
        //             spaceCount = 0;
        //             lastIndex = i;
        //         }else if (i === textString.length-1){
        //             var paragraph = '<p>' + textString.slice(lastIndex) + '</p>';
        //             content = content + paragraph;
        //             return;
        //         }else {
        //             if (textString[i] === ' ') {
        //                 spaceCount++;
        //             } else {
        //                 spaceCount = 0;
        //             }
        //         }
        //         // console.log('text', textString, 'i', i, 'spaceCount', spaceCount);

        //     }
        // }

        // descParser.call(this);
// <<<<<<< HEAD

//         this.backSurface = new Surface({
//             size: this.options.size,
//             classes: ['back-card'],
//             content: '<div class="back-card-desc">' + stripNewLines(truncate(this.options.job.description, 1000)) + '</div>'
// =======

        content = content.replace(/\s\s/g,"</div></br><div>")
                    .replace(/: /g,":</div></br><div>")
                    .replace(/\s-\s/g,"</div></div>-")
                    .replace(/\s\s/g,"</div></br><div>")
                    .replace(/\s([^A-Za-z0-9,.()\/])/g,"</div><div>$1")
                    .replace(/-([A-Z])/g,"</div><div>-$1");

        content = '<div>' + content + '</div>';

        this.backSurface = new Surface({
            size: this.options.size,
            classes: ['back-card', 'back-card-desc'],
            content: '<div>' + content + '</div>'

        });
    }

    function _createHandle() {
        var sync = new GenericSync({
            "mouse": {},
            "touch": {},
        });
        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.frontSurface.pipe(sync);
        this.backSurface.pipe(sync);

        sync.on('update', function(data) {
            var currentPosition = this.options.position.get();

            this.options.position.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
        }.bind(this));

        sync.on('end', function(data) {
            var currentPosition = this.options.position.get();
            var velocity = data.velocity;
            console.log(velocity);
            if (currentPosition[0] < -window.innerWidth / 6) {
                this._eventOutput.emit('swipeLeft');
            } else if (currentPosition[0] > window.innerWidth / 6) {
                this._eventOutput.emit('swipeRight');
            } else {
                this.options.position.set([0, 0], {
                    method: 'spring',
                    dampingRatio: 1,
                    period: 200,
                    velocity: velocity
                });
            }
        }.bind(this));

        var positionModifier = new Modifier({
            transform: function() {
                var currentPosition = this.options.position.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0.9);
            }.bind(this)
        });

        var rotationModifier = new Modifier({
            transform: function() {
                var currentPosition = this.options.position.get();
                return Transform.rotateZ(-0.0015 * currentPosition[0]);
            }.bind(this)
        });

        this.add(positionModifier).add(rotationModifier).add(this.mainNode);
    }

    function _createBackground() {
        this.rootModifier = new StateModifier({
            size: this.options.size,
            transform: Transform.inFront
        });

        this.mainNode = this.add(this.rootModifier);

        this.background = new Surface({
            // undefined size will inherit size from parent modifier
            properties: {
                backgroundColor: '#FFFFF5',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                background: 'transparent'
            }
        });
        this.mainNode.add(this.background);
    }

    function _createShadowBox() {
        this.shadowBox = new Surface({
            size: [window.innerWidth, window.innerHeight],
            properties: {
                backgroundColor: 'gray',
                pointerEvents: 'none'
            }
        });
        this.shadowModifier = new StateModifier({
            opacity: 0,
            transform: Transform.translate(0, 0, -10),
        });

        this.mainNode.add(this.shadowModifier).add(this.shadowBox);
        return this.mainNode;
    }


    function _setListeners() {
        this.frontSurface.on('click', function() {
            if (!this.options.toggle) {
                this._eventOutput.emit('flip');
            }
        }.bind(this));
        // this.flipForwardButton.on('click', function() {
        //     if (!this.options.toggle) {
        //         this._eventOutput.emit('flip');
        //     }
        // }.bind(this));
        this.backSurface.on('click', function() {
            //this.shadowModifier.setOpacity(0);
            if (this.options.toggle) {
                this._eventOutput.emit('flip');
                //this.shadowModifier.setOpacity(0);
            }
        }.bind(this));
    }

    module.exports = SlideView;
});
