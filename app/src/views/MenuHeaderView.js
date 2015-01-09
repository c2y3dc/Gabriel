define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MenuHeaderView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        // _createMenu.call(this);
        _createUserImage.call(this);
        _createUserName.call(this);
        _createUserTagLine.call(this);
        _createUserBio.call(this);
        _setListeners.call(this);
    }

    MenuHeaderView.prototype = Object.create(View.prototype);
    MenuHeaderView.prototype.constructor = MenuHeaderView;

    MenuHeaderView.DEFAULT_OPTIONS = {
        user: {},
        width: window.innerWidth,
        height: window.innerHeight,
        bullet: ' • ',
        userImageSize: window.innerHeight * 0.158,
        userImageUrl: 'img/profilePic.png',
        userName: 'Team Gabriel',
        userJob: 'Software Engineer',
        userLocation: 'San Francisco, CA',
        userBio: 'I am an angel investor in over 60 startups,\
        including Uber.com(first round).I have a $10m angel\
        fund and host the largest startup conference in the world',
        landingView: undefined,
    };

    // Create dark blue background
    function _createBackground() {
        this.backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: '#1976D2'
            }
        });

        var backgroundModifier = new StateModifier({
            origin: [0, 0],
            align: [0, 0]
        });

        this.add(backgroundModifier).add(this.backgroundSurface);
    }

    // Create menu toggle
    function _createMenu() {
        this.menuSurface = new ImageSurface({
            size: [20, 20],
            content: 'img/menu.svg'
        });

        var menuModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.05, this.options.height * 0.044, 0),
            origin: [0, 0],
            align: [0, 0]
        })

        this.add(menuModifier).add(this.menuSurface);
    }

    // Create user image circle
    function _createUserImage() {
        this.userImageSurface = new ImageSurface({
            size: [this.options.userImageSize, this.options.userImageSize],
            content: this.options.user.image || this.options.userImageUrl,
            properties: {
                backgroundColor: 'white',
                borderRadius: this.options.userImageSize / 2 + 'px'
            }
        });

        var userImageModifier = new StateModifier({
            transform: Transform.translate((this.options.width - this.options.userImageSize) * 0.5, this.options.height * 0.066, 0),
            origin: [0, 0],
            align: [0, 0]
        });

        this.add(userImageModifier).add(this.userImageSurface);
    }

    // Create username
    function _createUserName() {
        var userNameSurface = new Surface({
            size: [true, true],
            content: this.options.user.name || 'Team Gabriel',
            properties: {
                color: 'white',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontSize: '22px'
            }
        });

        var userNameModifier = new StateModifier({
            transform: Transform.translate(this.options.width / 2, this.options.height * 0.52, 0),
            origin: [0.5, 0.5],
            align: [0, 0]
        });

        this.add(userNameModifier).add(userNameSurface);
    }

    // Create user job title and location
    function _createUserTagLine() {
        var userTagLineSurface = new Surface({
            size: [this.options.width * 0.9, true],
            content: this.options.userJob + this.options.bullet + (this.options.user.locations[0].display_name ||  this.options.userLocation),
            properties: {
                color: 'white',
                textAlign: 'center',
                fontSize: '15px'
            }
        });

        var userTagLineModifier = new StateModifier({
            transform: Transform.translate(this.options.width / 2, this.options.height * 0.62, 0),
            origin: [0.5, 0.5],
            align: [0, 0]
        })

        this.add(userTagLineModifier).add(userTagLineSurface);
    }

    // Create user short bio
    function _createUserBio() {
        var userBioSurface = new Surface({
            size: [this.options.width * 0.95, true],
            content: this.options.user.bio || this.options.userBio,
            properties: {
                color: 'white',
                textAlign: 'center',
                fontWeight: 300,
                fontSize: '12px',
                letterSpacing: '0.5px'
            }
        });

        var userBioModifier = new StateModifier({
            transform: Transform.translate(this.options.width / 2, this.options.height * 0.82, 0),
            origin: [0.5, 0.5],
            align: [0, 0]
        })

        this.add(userBioModifier).add(userBioSurface);
    }

    //THIS NEEDS TO TRANSLATE THE LANDING VIEW FORWARD BUT I DON'T KNOW HOW

    function _setListeners() {
        console.log('Im listening')
        this.userImageSurface.on('click', function() {
            console.log('Im clicked');
            if(window.cordova){
                window.cookies.clear(function() {
                    console.log('Cookies cleared!');
                });
            }else{
                window.open('https://www.angel.co/logout');

            }
            this.options.landingView.rootModifier.setTransform(Transform.translate(0, 0, 10000), {
                        duration: 1000
                    });
            console.log("LANDING", this.options.landingView);
        }.bind(this));
        //console.log('this OPTIONS after and outside popup', this.options);

    }


    module.exports = MenuHeaderView;
});
