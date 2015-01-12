define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Utility = require('famous/utilities/Utility');


    function LandingView() {
        View.apply(this, arguments);
        this.angel = {};

        _createBackground.call(this);
        _createLoginButton.call(this);
        // _createRedirectButton.call(this);
        _createName.call(this);
        _createTagLine.call(this);
        // _createWings.call(this);
        _setListeners.call(this);
        //console.log('INSIDE CONSTRUCTOR',this.options);
    }

    LandingView.prototype = Object.create(View.prototype);
    LandingView.prototype.constructor = LandingView;

    LandingView.DEFAULT_OPTIONS = {
        width: window.innerWidth,
        height: window.innerHeight,
        angel: {},
        initialData: {},
    };

    function _createBackground() {
        this.backgroundSurface = new ImageSurface({});

        this.rootModifier = new StateModifier({
            transform: Transform.translate(0, 0, 200)
        });

        this.root = this.add(this.rootModifier)
        this.root.add(this.backgroundSurface);
    }

    // function _createWings() {
    //   this.leftWing = new ImageSurface({
    //     size: [window.innerWidth/2, window.innerHeight/1.2],
    //     content: 'img/leftwing.png',
    //     origin: [1,0],
    //     zIndex: 10
    //   })
    //   this.rightWing = new ImageSurface({
    //     size: [window.innerWidth/2, window.innerHeight/1.2],
    //     content: 'img/rightwing.png',
    //     origin: [0,0],
    //     zIndex: 10
    //   })
    //   this.wingModifier = new StateModifier({
    //     align: [0.5, 0.1],
    //     transform: Transform.translate(0,0,10)
    //   })
    //   this.wingNode = this.add(this.wingModifier);
    //   this.wingNode.add(this.leftWing);
    //   this.wingNode.add(this.rightWing);
    // }

    function _createName() {
        this.name = new Surface({
            size: [this.options.width / 2, this.options.height / 6],
            content: 'GABRIEL',
            properties: {
                textAlign: 'center',
                fontFamily: 'Josefin Sans, Helvetica Neue, Helvetica, Arial, sans-serif',
                color: '#9E9E9E',
                fontSize: this.options.width * 0.17 + 'px',
                /* margin-left: 25px; */
                letterSpacing: '2px',
                fontWeight: 100
            }
        })
        this.nameModifier = new StateModifier({
            origin: [0, 0.5],
            align: [0.1, 0.5],
        })
        this.root.add(this.nameModifier).add(this.name);
    }

    function _createTagLine() {
        this.tagLine = new Surface({
            size: [true, this.options.height * 0.1],
            content: 'FINDING JOBS MADE EASY',
            properties: {
                textAlign: 'center',
                fontFamily: 'Josefin Sans, Helvetica Neue, Helvetica, Arial, sans-serif',
                color: '#9E9E9E',
                fontSize: this.options.width * 0.04 + 'px',
                fontWeight: 300
            }
        })
        this.tagLineModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.11, this.options.height * 0.01, 0),
            origin: [0, 0],
            align: [0, 0.5]
        })

        this.root.add(this.tagLineModifier).add(this.tagLine);
    }

    function _createLoginButton() {
        this.loginButton = new Surface({
            size: [this.options.width * 0.525, this.options.height * 0.08],
            content: 'SIGN IN WITH ANGEL LIST',
            properties: {
                fontSize: this.options.width * 0.0325 + 'px',
                color: '#34C9AB',
                border: '1px solid #34C9AB',
                borderRadius: '4px',
                textAlign: 'center',
                letterSpacing: this.options.width * 0.002 + 'px',
                lineHeight: this.options.height * 0.08 + 'px',
                fontWeight: 600
            }
        })
        this.loginButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.70],
        });

        this.root.add(this.loginButtonModifier).add(this.loginButton);
    }

    // function _createRedirectButton() {
    //     //console.log('CORRECT THIS',this);
    //     this.redirectButton = new Surface({
    //         content: 'Get Started with Angel List',
    //         classes: ['landing-buttons', 'redirect-button']
    //
    //     })
    //
    //     this.redirectButtonModifier = new StateModifier({
    //         size: [window.innerWidth / 1.8, window.innerHeight / 25],
    //         origin: [0.5, 0.5],
    //         align: [0.5, 0.85],
    //         transform: Transform.inFront
    //     });
    //
    //     this.root.add(this.redirectButtonModifier).add(this.redirectButton);
    // }


    function _setListeners() {
        this.loginButton.on('click', function() {
            //call oauth.io popup
            // console.log('this before popup', this);
            OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
            OAuth.popup('angel_list', {
                cache: true
            }).done(function(result) {
                //this event triggers splash page:
                this._eventOutput.emit('loggedin')

                this.options.angel = result;
                ANGEL = result;
                result.get('/1/me').done(function(data) {
                    this.options.userData = data;
                    ME = data;
                    console.log(this.options.userData);
                }.bind(this)).fail(function(oops) {
                    console.log('unable to get user data');
                }.bind(this));

                result.get('/1/jobs').done(function(data) {
                    this.options.initialData = data;
                    console.log(data);
                    this._eventOutput.emit('loaded');
                    // this.rootModifier.setOpacity(0, {
                    //     duration: 1000
                    // });
                    this.rootModifier.setTransform(Transform.translate(-window.innerWidth * 2, 0, 0), {
                        duration: 500
                    });
                }.bind(this)).fail(function(oops) {
                    console.log('unable to get job data');
                }.bind(this));
            }.bind(this));

        }.bind(this));
        //console.log('this OPTIONS after and outside popup', this.options);
    }


    module.exports = LandingView;
});
