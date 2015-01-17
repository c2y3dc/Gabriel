define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var SlideData = require('data/SlideData');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Flipper = require("famous/views/Flipper");
    var Scrollview = require("famous/views/Scrollview");
    var Easing = require('famous/transitions/Easing');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var RenderNode = require('famous/core/RenderNode');
    var SequentialLayout = require("famous/views/SequentialLayout");
    //var FastClick = require('famous/inputs/FastClick');
    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.registerMethod('spring', SnapTransition);

    var NoteView = require('views/NoteView');


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
        // _createNoteView.call(this);
        //_createBackground.call(this);
        _createFlipper.call(this);
        _createHandle.call(this);
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
        job_type: 'Full Time',
        noteToggle: false,
        flipping: false
    };

    SlideView.prototype.showNote = function() {
        this.options.noteToggle = true;
        if (window.cordova) {
            cordova.plugins.Keyboard.close();
        }
        this.noteModifier.setTransform(Transform.translate(0, 0, 10), {
            method: 'spring',
            dampingRatio: 1,
            period: 100
        }, function() {}.bind(this));

        this.noteModifier.setOpacity(1, {
            duration: 0
        });


        return this.noteModifier;
    };

    SlideView.prototype.hideNote = function(callback) {
        if (window.cordova) {
            cordova.plugins.Keyboard.close();
        }
        this.noteModifier.setTransform(Transform.translate(0, window.innerHeight * 2, 10), {
            method: 'spring',
            dampingRatio: 1,
            period: 100
        }, callback);
        return this.noteModifier;
    };

    function _createFlipper() {
        this.flipper = new Flipper();
        _createCardFront.call(this);
        _createCardBack.call(this);

        this.flipper.setFront(this.frontNode);
        this.flipper.setBack(this.backNode);

        this.cardNode.add(this.flipper);

        // _createNoteButton.call(this);
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

        this.backSurfaceModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.9)
        });

        var content;
        if (!this.options.job.description || this.options.job.description === '') {
            content = 'No Description Provided';
        } else {
            content = this.options.job.description.slice();
        }


        
        this.backModifier = new Modifier({});
        

        content = content.replace(/\s\s/g, "</div></br><div class='back-card-desc'>")
            .replace(/: /g, ":</div></br><div class='back-card-desc'>")
            .replace(/\s-\s/g, "</div><div class='back-card-desc'>-")
            .replace(/\s\s/g, "</div></br><div class='back-card-desc'>")
            .replace(/\s([^A-Za-z0-9,.&()\/])/g, "</div><div class='back-card-desc'>$1")
            .replace(/-([A-Z])/g, "</div><div class='back-card-desc'>-$1");


        content = '<div class="back-card-desc">' + content + '</div>';


        content = content.split('</br>');

        this.scrollSurfaces = [];

        this.backSurface = new ContainerSurface({
            classes: ['back-card'],
            size: this.options.size,
        
        });

        this.scrollModifier = new Modifier({
            size: [undefined, 2]
        });

        this.scrollview = new Scrollview({
            rails: true
        });
       
        var prevSurface;
        
        content.forEach(function(div){
            var divSurface = new Surface({
                classes: ['scroll-container'],
                size: [undefined, true],
                content: div
            });

            divSurface.pipe(this.scrollview);

            divSurface.node = new RenderNode();
            divSurface.mod = new Modifier();


            divSurface.node.add(divSurface.mod).add(divSurface);

            this.scrollSurfaces.push(divSurface);

            prevSurface = divSurface;
        }.bind(this));

        var scrollLayout = [];

        var sequentialLayout = new SequentialLayout({
            size: [undefined, true],
            itemSpacing: 10
        });

        sequentialLayout.sequenceFrom(this.scrollSurfaces);
        scrollLayout.push(sequentialLayout);

        this.scrollview.sequenceFrom(scrollLayout);

        this.backSurface.add(this.scrollModifier).add(this.scrollview);
        
        
        this.backNode = this.cardNode.add(this.backModifier);
        this.backNode.add(this.backSurface);

    }

    // function _createNoteButton() {         
    //     this.noteSurface = new Surface({        
    //         size: [this.options.width * 0.225, this.options.height * 0.05],
    //                 content: 'NOTE',
    //                 properties: {          
    //             fontSize: this.options.width * 0.03 + 'px',
    //                       color: '#34C9AB',
    //                       backgroundColor: 'white',
    //                       border: '1px solid #34C9AB',
    //                       borderRadius: '4px',
    //                       textAlign: 'center',
    //                       letterSpacing: this.options.width * 0.002 + 'px',
    //                       lineHeight: this.options.height * 0.048 + 'px',
    //                       fontWeight: 600,
    //                     
    //         }      
    //     });

              
        // this.noteMod = new StateModifier({        
        //     transform: Transform.translate(this.options.width * 0.29, this.options.height * 0.3, 0.9)      
        // });

    //     this.frontNode.add(this.noteMod).add(this.noteSurface);

    // }

    function _createNoteView() {
        this.noteView = new NoteView();
        this.noteModifier = new StateModifier({
            opacity: 0,
            transform: Transform.translate(0, window.innerHeight * 1.5, 10)
        });
        this.add(this.noteModifier).add(this.noteView);
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
                          color: '#fff',
                backgroundColor: '#34C9AB',
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

        var touch = new TouchSync({});
        // now surface's events are piped to `MouseSync`, `TouchSync` and `ScrollSync`
        this.frontSurface.pipe(sync);

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
                //boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                background: 'transparent'
            }
        });
        this.mainNode.add(this.background);
    }

    function _setListeners() {

        // this.noteSurface.on('touchend', function() {
        //     this.options.noteToggle = true;
        //     this.showNote();
        // }.bind(this));

        // this.noteView.cancelButtonSurface.on('touchstart', function() {
        //     this.hideNote(function() {
        //         this.options.noteToggle = false;
        //     }.bind(this));
        // }.bind(this));

        // this.noteView.submitButtonSurface.on('touchend', function() {
        //     this.options.note = this.noteView.inputSurface.getValue();
        //     if (window.cordova) {
        //         cordova.plugins.Keyboard.close();
        //     }
        //     this.hideNote();
        //     //console.log('getVal', this.noteView.inputSurface.getValue());
        //     this._eventOutput.emit('swipeRight');
        // }.bind(this));

        this.on('opacitateRight',
            function() {
                this.archiveFeedbackSurface.archiveMod.setOpacity(0);
                this.interestedFeedbackSurface.interestedMod.opacityFrom(function() {
                    var currentPosition = this.options.position.get();
                    return (currentPosition[0] / 200);
                }.bind(this));
            }.bind(this));

        this.on('opacitateLeft',
            function() {
                this.interestedFeedbackSurface.interestedMod.setOpacity(0);
                this.archiveFeedbackSurface.archiveMod.opacityFrom(function() {
                    var currentPosition = this.options.position.get();
                    return (Math.abs(currentPosition[0] / 200));
                }.bind(this));
            }.bind(this));


        this.frontSurface.on('click', function() {
            this.options.flipping = true;
            if (!this.options.toggle && !this.options.noteToggle) {
                this._eventOutput.emit('flip')

            }
        }.bind(this));

        this.backSurface.on('click', function() {;
            this.options.flipping = true;
            if (this.options.toggle && !this.options.noteToggle) {
                this._eventOutput.emit('flip');
            }
        }.bind(this));
    }

    module.exports = SlideView;
});
