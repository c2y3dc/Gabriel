define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');
    var FastClick = require('famous/inputs/FastClick');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);

    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');

    var LandingView = require('views/LandingView');
    var LoadingView = require('views/LoadingView');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync,
    });

    function AppView() {
        View.apply(this, arguments);

        _createLandingView.call(this);

        this.landingView.on('loggedin', function() {
            console.log('logged in');
            _createLoadingPage.call(this);
        }.bind(this));

        this.landingView.on('loaded', function() {
            this.angel = this.landingView.options.angel;
            this.gabrielMenu = true;

            this.pageViewPos = 0;

            _createPageView.call(this);
            _createMenuView.call(this);

            _setListeners.call(this);

        }.bind(this));

    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        userData: {},
        angel: {},
        jobs: {},
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 500,
            curve: 'easeOut'
        }
    };

    // GabrielPage Toggle
    AppView.prototype.showFullGabrielPage = function(callback) {
        this.pageModifier.setTransform(Transform.translate(0, 0, 0.9), this.options.transition, callback);
    };

    AppView.prototype.removeGabrielPage = function() {
        this.pageModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), {
            duration: 450,
            curve: 'easeOut'
        });
    };

    AppView.prototype.toggleGabrielPage = function() {
        if (this.gabrielMenu) {
            console.log('remove garielPage page');

            // this.menuModifier.setTransform(Transform.translate(0, 0, 0));
            this.removeGabrielPage();
            this.showFullMenuPage();
        } else {
            console.log('show full Gariel Page');
            this.showFullGabrielPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showGabrielPage = function() {
        this.gabrielMenu = true;
        this.showFullGabrielPage(function() {
            this.menuModifier.setTransform(Transform.translate(-window.innerWidth * 2, 0, -100), this.options.transition);
        }.bind(this));
    };

    // MenuPage Toggle
    AppView.prototype.showFullMenuPage = function() {
        this.menuModifier.setTransform(Transform.translate(0, 0, 0));
    };

    AppView.prototype.removeMenuPage = function() {
        this.pageModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), this.options.transition);
    };

    AppView.prototype.toggleMenuPage = function() {
        if (this.gabrielMenu) {
            console.log('remove garielPage page');
            this.removeMenuPage();
        } else {
            console.log('show full Gariel Page');
            this.showFullMenuPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showMenuPage = function() {
        console.log('show full GarielPage');
        this.gabrielMenu = true;
        this.showFullMenuPage();
    };


    function _createLoadingPage() {
        this.loadingView = new LoadingView();
        this.loadingModifier = new StateModifier({
            transform: Transform.translate(0, 0, 201)
        });
        this.add(this.loadingModifier).add(this.loadingView);
    }

    function _removeLoadingView() {
        this.loadingModifier.setTransform(Transform.translate(window.innerWidth * 4, 0, 201));
    }

    function _createPageView() {
        this.pageView = new PageView({
            jobs: this.landingView.options.jobs,
            angel: this.options.angel
        });
        this.pageModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(this.pageModifier).add(this.pageView);
    }

    function _createMenuView() {
        this.menuView = new MenuView({
            userData: this.landingView.options.userData,
            landingView: this.landingView
        });
        this.menuModifier = new StateModifier({
            transfoårm: Transform.translate(-window.innerWidth, 0, 0)
        });

        this.add(this.menuModifier).add(this.menuView);
    }

    function _createLandingView() {
        this.landingView = new LandingView();
        this.landingModifier = new StateModifier({
            transform: Transform.translate(0, 0, 1)
        });

        this.add(this.landingModifier).add(this.landingView);
        this.options.angel = this.landingView.options.results;
        this.options.initialData = this.landingView.options.initialData;
    }


    function _setListeners() {
        this.pageView.on('firstSlideReady', function() {
            _removeLoadingView.call(this);
        }.bind(this));

        this.pageView.on('menuToggle', this.toggleGabrielPage.bind(this));

        this.menuView.on('gabrielOnly', this.showGabrielPage.bind(this));
    }

    module.exports = AppView;
});
