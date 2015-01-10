define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MenuHeaderView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        _createCancelButton.call(this);
        _createUserImage.call(this);
        _createUserName.call(this);
        _createLocationPin.call(this);
        _createUserLocation.call(this);
        _createUserBio.call(this);
        _createBuiltWithFamous.call(this);
        _createLogoutButton.call(this);

        _setListeners.call(this);
    }

    MenuHeaderView.prototype = Object.create(View.prototype);
    MenuHeaderView.prototype.constructor = MenuHeaderView;

    MenuHeaderView.DEFAULT_OPTIONS = {
        user: {},
        width: window.innerWidth,
        height: window.innerHeight,
        bullet: ' • ',
        userImageSize: window.innerWidth * 0.28125,
        userImageUrl: 'img/profilePic.png',
        userName: 'Team Gabriel',
        userJob: 'Software Engineer',
        userLocation: 'No location provided',
        userBio: 'No information provided',
        landingView: undefined,
    };

    // Create dark blue background
    function _createBackground() {
        this.backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: 'white'
            }
        });

        var backgroundModifier = new StateModifier({
            origin: [0, 0],
            align: [0, 0]
        });

        this.add(backgroundModifier).add(this.backgroundSurface);
    }

    // Create menu toggle
    function _createCancelButton() {
        this.cancelSurface = new ImageSurface({
            size: [22, 22],
            content: 'img/cancel.svg'
        });

        var menuModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.05, this.options.height * 0.05, 1),
            origin: [0, 0],
            align: [0, 0]
        })

        this.add(menuModifier).add(this.cancelSurface);
    }

    // Create user image circle
    function _createUserImage() {
        this.userImageSurface = new ImageSurface({
            size: [this.options.userImageSize, this.options.userImageSize],
            content: this.options.user.image,
            properties: {
                backgroundColor: 'white',
                borderRadius: this.options.userImageSize + 'px'
            }
        });

        var userImageModifier = new StateModifier({
            transform: Transform.translate(0, this.options.height * 0.1496, 0),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.add(userImageModifier).add(this.userImageSurface);
    }

    // Create username
    function _createUserName() {
        var userNameSurface = new Surface({
            size: [true, true],
            content: this.options.user.name,
            properties: {
                color: 'black',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: this.options.width * 0.06 + 'px',
                fontWeight: 600
            }
        });

        var userNameModifier = new StateModifier({
            transform: Transform.translate(this.options.width / 2, this.options.height * 0.3477, 0),
            origin: [0.5, 0.5],
            align: [0, 0]
        });

        this.add(userNameModifier).add(userNameSurface);
    }

    function _createLocationPin() {
        this.locationPinSurface = new ImageSurface({
            size: [true, true],
            content: 'img/pin.svg'
        });

        this.locationPinModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.341, 0.395]
        });

        this.add(this.locationPinModifier).add(this.locationPinSurface);
    }

    // Create user job title and location
    function _createUserLocation() {
        var userLocation = new Surface({
            size: [this.options.width * 0.9, true],
            content: this.options.user.locations[0].display_name || this.options.userLocation,
            properties: {
                color: '#9E9E9E',
                textAlign: 'center',
                fontSize: this.options.width * 0.04 + 'px',
                fontWeight: 300,
                textTransform: 'uppercase'
            }
        });

        var userLocationModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.53, 0.4]
        })

        this.add(userLocationModifier).add(userLocation);
    }

    // Create user short bio
    function _createUserBio() {
        var userBioSurface = new Surface({
            size: [this.options.width * 0.80, true],
            content: this.options.user.what_i_do || this.options.userBio,
            properties: {
                color: '#9E9E9E',
                textAlign: 'center',
                fontWeight: 400,
                fontSize: this.options.width * 0.045 + 'px',
            }
        });

        var userBioModifier = new StateModifier({
            transform: Transform.translate(0, this.options.height * 0.478, 0),
            origin: [0.5, 0.5],
            align: [0.5, 0]
        })

        this.add(userBioModifier).add(userBioSurface);
    }

    function _createBuiltWithFamous() {
        this.famousSurface = new Surface({
            size: [true, true],
            content: 'GABRIEL built with Famo.us',
            properties: {
                fontSize: this.options.width * 0.035 + 'px',
                color: '#9F9F9F',
                fontWeight: 600
            }
        });

        this.famousModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.84]
        })

        this.add(this.famousModifier).add(this.famousSurface);
    }

    function _createLogoutButton() {
        this.logoutButton = new Surface({
            size: [this.options.width * 0.25, this.options.height * 0.044],
            content: 'SIGN OUT',
            properties: {
                fontSize: this.options.width * 0.0325 + 'px',
                color: '#34C9AB',
                border: '1px solid #34C9AB',
                borderRadius: '4px',
                textAlign: 'center',
                letterSpacing: this.options.width * 0.002 + 'px',
                lineHeight: this.options.height * 0.044 + 'px',
                fontWeight: 600
            }
        })
        this.logoutButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.924],
        });

        this.add(this.logoutButtonModifier).add(this.logoutButton);
    }

    //THIS NEEDS TO TRANSLATE THE LANDING VIEW FORWARD BUT I DON'T KNOW HOW

    function _setListeners() {

      this.cancelSurface.on('click', function() {
        console.log('im clicked');
        this._eventOutput.emit('gabrielOnly');
      });
        this.logoutButton.on('click', function() {
            if (window.cordova) {
                
                     OAuth.clearCache();
            
            } else {
                window.open('https://www.angel.co/logout');

            }
            
            console.log("LANDING", this.options.landingView);
            this.options.landingView.setTransform(function(){
                return Transform.translate(0,0,0);
            }, {duration:400});
        }.bind(this));
        //console.log('this OPTIONS after and outside popup', this.options);

    }


    module.exports = MenuHeaderView;
});
