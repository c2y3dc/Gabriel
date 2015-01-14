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
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var RenderNode = require('famous/core/RenderNode');
    //var FastClick = require('famous/inputs/FastClick');
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

    function _createFlipper() {
        this.flipper = new Flipper();
        _createCardFront.call(this);
        _createCardBack.call(this);

        this.flipper.setFront(this.frontNode);
        this.flipper.setBack(this.backNode);

        this.cardNode.add(this.flipper);


        _createInterestedFeedback.call(this);
        _createArchiveFeedback.call(this);        
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
                fontSize: this.options.job.title.length
            },
            content: [
                '<div class="card_header">',
                '<img class="logo_url" src="', this.options.job.startup.logo_url, '">',
                '<p class="startup_name">', this.options.job.startup.name, '</p>',
                '<p class="high_concept">', truncate(this.options.job.startup.high_concept, 120), '</p>',
                '</div>',
                '<div class="divider">', '</div>',
                '<img class="flip_button" src="img/flip.svg">',
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
    }

    function _createCardBack() {
        this.backSurfaceModifier = new StateModifier();

        this.backNode = this.cardNode.add(this.backSurfaceModifier);
        var backSurfaces = [];
        var content;
        if (!this.options.job.description || this.options.job.description === '') {
            content = 'No Description Provided';
        } else {
            content = this.options.job.description.slice();
        }

        this.backScrollView = new Scrollview();

        this.backScrollView.sequenceFrom(backSurfaces);

        content = content.replace(/\s\s/g, "</div></br><div>")
            .replace(/: /g, ":</div></br><div>")
            .replace(/\s-\s/g, "</div></div>-")
            .replace(/\s\s/g, "</div></br><div>")
            .replace(/\s([^A-Za-z0-9,.&()\/])/g, "</div><div>$1")
            .replace(/-([A-Z])/g, "</div><div>-$1");

        content = '<div class="job_description">' + content + '</div>';

        this.backView = new View({
            size: [undefined, undefined]
        });

        this.backSurface = new Surface({
            size: this.options.size,
            classes: ['back-card', 'back-card-desc'],
            content: '<div>' + content + '</div>'
        });

        this.backSurface.pipe(this.backScrollView);

        this.backSurface.state = new StateModifier({
            transform: Transform.translate(0, 0, 0.9)
        })

        this.backView.add(this.backSurface.state).add(this.backSurface);

        backSurfaces.push(this.backView);

        this.backNode.add(this.backScrollView);

        // this.contextSize = this.backNode.getSize();

        // this.contentSize = window.innerHeight; // Most Likely you keep track of this when creating

        // this.scrollbarSize = this.contextSize[1] * this.contextSize[1] / (this.contentSize);

        // this.scrollbar = new Surface({
        //     size: [10, this.scrollbarSize],
        //     properties: {
        //         backgroundColor: 'rgb(52, 201, 171)'
        //     }
        // })

        // console.log(this.scrollbar);

        // this.scrollbar.draggable = new Draggable({
        //     xRange: [0, 0],
        //     yRange: [0, this.contextSize[1] - this.scrollbarSize]
        // })

        // this.scrollbar.pipe(this.scrollbar.draggable);

        // this.backNode.add(this.scrollbar.draggable).add(this.scrollbar);

    }

        
    function _createArchiveFeedback() {           
        this.archiveFeedbackSurface = new Surface({        
            size: [this.options.width * 0.225, this.options.height * 0.05],
                    content: 'ARCHIVE',
                    properties: {          
                fontSize: this.options.width * 0.03 + 'px',
                          color: '#8f8f8f',
                          border: '2px solid #8f8f8f',
                          borderRadius: '4px',
                          textAlign: 'center',
                          letterSpacing: this.options.width * 0.002 + 'px',
                          lineHeight: this.options.height * 0.05 + 'px',
                          fontWeight: 600,
                        
            }      
        });

        this.archiveFeedbackSurface.node = new RenderNode();

        this.archiveFeedbackSurface.archiveMod = new Modifier({        
            opacity: 0,
            transform: Transform.translate(this.options.width * 0.29, -this.options.height * 0.275, 0.9)      
        });

        this.archiveFeedbackSurface.rotationMod = new Modifier({
            transform: Transform.rotate(0, 0, 0.5)  
        })

        this.archiveFeedbackSurface.node.add(this.archiveFeedbackSurface.archiveMod).add(this.archiveFeedbackSurface.rotationMod).add(this.archiveFeedbackSurface);

              
        this.frontNode.add(this.archiveFeedbackSurface.node);    
    }

        
    function _createInterestedFeedback() {           
        this.interestedFeedbackSurface = new Surface({        
            size: [this.options.width * 0.225, this.options.height * 0.05],
                    content: 'INTERESTED',
                    properties: {          
                          fontSize: this.options.width * 0.03 + 'px',
                          color: '#34C9AB',
                          border: '2px solid #34C9AB',
                          borderRadius: '4px',
                          textAlign: 'center',
                          letterSpacing: this.options.width * 0.002 + 'px',
                          lineHeight: this.options.height * 0.05 + 'px',
                          fontWeight: 600,
            }      
        });

              

        this.interestedFeedbackSurface.node = new RenderNode();

        this.interestedFeedbackSurface.interestedMod = new Modifier({        
            opacity: 0,
                    transform: Transform.translate(-this.options.width * 0.29, -this.options.height * 0.275, 0.9)      
        });

        this.interestedFeedbackSurface.rotationMod = new Modifier({
            transform: Transform.rotate(0, 0, -0.5)
        })


        this.interestedFeedbackSurface.node.add(this.interestedFeedbackSurface.interestedMod).add(this.interestedFeedbackSurface.rotationMod).add(this.interestedFeedbackSurface);

        this.frontNode.add(this.interestedFeedbackSurface.node);        

    }

    function _createHandle() {
        var sync = new GenericSync({
            "mouse": {},
            "touch": {}
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

            if (currentPosition[0] > 0) {
                this._eventOutput.emit('opacitateRight');
            } else if (currentPosition[0] < 0) {
                this._eventOutput.emit('opacitateLeft')
            }

        }.bind(this));

        sync.on('end', function(data) {
            var currentPosition = this.options.position.get();
            var velocity = data.velocity;
            //console.log(velocity);
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

    function _setListeners() {

        this.on('opacitateRight',
            function() {
                this.archiveFeedbackSurface.archiveMod.setOpacity(0);
                this.interestedFeedbackSurface.interestedMod.opacityFrom(function() {
                    var currentPosition = this.options.position.get();
                    return (currentPosition[0] / 200)
                }.bind(this));

            }.bind(this));

        this.on('opacitateLeft',
            function() {
                this.interestedFeedbackSurface.interestedMod.setOpacity(0);
                this.archiveFeedbackSurface.archiveMod.opacityFrom(function() {
                    var currentPosition = this.options.position.get();
                    return (Math.abs(currentPosition[0] / 200))
                }.bind(this));

            }.bind(this));


        this.frontSurface.on('click', function() {
            if (!this.options.toggle) {
                this._eventOutput.emit('flip')

            }
        }.bind(this));

        this.backSurface.on('click', function() {;
            if (this.options.toggle) {
                this._eventOutput.emit('flip');
            }
        }.bind(this));
    }

    module.exports = SlideView;
});
