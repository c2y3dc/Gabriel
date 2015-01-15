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
    var ModifierChain = require('famous/modifiers/ModifierChain');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);

    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');

    var LandingView = require('views/LandingView');
    var LoadingView = require('views/LoadingView');
    var Main = require('main');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync,
    });

    function AppView() {
        View.apply(this, arguments);

        _createLandingView.call(this);

        this.landingView.on('loggedin', function() {

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

    AppView.prototype.toggleMenuPage = function() {
        if (this.gabrielMenu) {
            this.removeMenuPage();
        } else {
            this.showFullMenuPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };


    AppView.prototype.removeMenuPage = function() {
        this.pageModifier.setOpacity(1, {
            duration: 175
        });
        this.pageModifier.setTransform(Transform.translate(0, 0, 0.1), {
            duration: 175
        });
        this.menuView.xState.setOpacity(0, {
            duration: 175
        });
        this.menuView.xState.setTransform(Transform.translate(0, 0, 700), {
            duration: 175
        }, function() {
            this.menuView.xState.setTransform(Transform.translate(-window.innerWidth * 2, 0, 700), {
                duration: 0
            });
        }.bind(this));
    };


    AppView.prototype.signout = function() {
        console.log('recognizes prototype function');
        // this.landingView.rootModifier.setTransform(Transform.translate(0, 0, 5), {duration: 300});
        OAuth.clearCache('angel_list');
        // Create the event.
        // var event = document.createEvent('Event');
        // // Define that the event name is 'build'.
        // event.initEvent('build', true, true);
        // // Listen for the event.
        // document.addEventListener('build', function(e) {
        //     // e.target matches document from above
        // }, false);
        // // target can be any Element or other EventTarget.
        // var build = function() {
        //     document.dispatchEvent(event);
        // };

        window.location.reload();

        setTimeout(build, 300)
        delete this;

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

    // MenuPage Toggle
    AppView.prototype.showFullMenuPage = function() {
        this.pageModifier.setOpacity(0, {
            duration: 175
        });
        this.pageModifier.setTransform(Transform.translate(0, 0, -700), {
            duration: 175
        });
        this.menuView.xState.setTransform(Transform.translate(0, 0, 700), {
            duration: 60
        }, function() {
            this.menuView.xState.setTransform(Transform.translate(0, 0, 0.9), {
                duration: 175
            });
            this.menuView.xState.setOpacity(1, {
                duration: 175
            });
        }.bind(this));
    };

    function _createMenuView() {
        this.menuView = new MenuView({
            userData: this.landingView.options.userData,
            landingView: this.landingView
        });

        this.menuView.xState = new StateModifier({
            opacity: 0,
            transform: Transform.translate(-window.innerWidth * 2, 0, 700)
        });

        this.menuView.yState = new StateModifier();
        this.menuView.chain = new ModifierChain();

        this.menuView.chain.addModifier(this.menuView.xState);
        this.menuView.chain.addModifier(this.menuView.yState);

        this.add(this.menuView.chain).add(this.menuView);
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

        this.pageView.on('menuToggle', this.toggleMenuPage.bind(this));
        this.menuView.on('menuToggle', this.toggleMenuPage.bind(this));

        this.menuView.on('signoutClicked', this.signout.bind(this));
    }

    module.exports = AppView;
});
