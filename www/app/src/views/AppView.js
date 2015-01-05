define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');

    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');

    var CardView = require('views/CardView');

    var FastClick = require('famous/inputs/FastClick');

    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);

    var posititon = new Transitionable([0, 0]);

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    var StripData = require('data/StripData');
    var MatchView = require('views/MatchView');
    var PageView = require('views/PageView');
    var MenuView = require('views/MenuView');
    var SettingsView = require('views/SettingsView');
    var StarredView = require('views/StarredView');
    var FeedbackView = require('views/FeedbackView');
    var ProfileView = require('views/ProfileView');
    var LandingView = require('views/LandingView');

    function AppView() {
        View.apply(this, arguments);

        ///var results = this.getOptions('jobs');
        this.jobs = this.options.jobs
        console.log(this.jobs[0]);


        this.gabrielMenu = true;
        this.settingsMenu = true;
        this.starredMenu = true;
        this.feedbackToggle = true;
        this.matchViewToggle = false;
        this.pageViewPos = 0;

        //_createLandingView.call(this);
        _createPageView.call(this);
        _createMatchView.call(this);
        _createMenuView.call(this);
        _createSettingsView.call(this);
        _createStarredView.call(this);
        _createProfileView.call(this);
        _createFeedbackView.call(this);

        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        jobs: undefined,
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 300,
            curve: Easing.outBack
        }
    };

    // ProfilePage Toggle
    AppView.prototype.moveProfilePageAside = function() {
        this.profileModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.showFullProfilePage = function() {
        this.profileModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    AppView.prototype.removeProfilePage = function() {
        this.profileModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), this.options.transition);
    };

    AppView.prototype.toggleProfileMenu = function() {
        if (this.profileMenu) {
            console.log('move profilePage aside');
            this.moveProfilePageAside();
            this.menuView.animateStrips();
        } else {
            console.log('show full Profile Page');
            this.showFullProfilePage();
            this.removeGabrielPage();
            this.removeSettingsPage();
            this.removeStarredPage();
            // this.removeFeedbackPage();
        }
        this.profileMenu = !this.profileMenu;
    };

    AppView.prototype.showProfilePage = function() {
        console.log('show full ProfilePage');
        this.profileMenu = true;
        this.showFullProfilePage();
        this.removeGabrielPage();
        this.removeSettingsPage();
        this.removeStarredPage();
    };

    // GabrielPage Toggle
    AppView.prototype.moveGabrielPageAside = function() {
        this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
        
    };

    AppView.prototype.showFullGabrielPage = function() {
        this.menuModifier.setTransform(Transform.translate(-window.innerWidth * 2,0,0), { duration: 0 });
        this.pageModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    AppView.prototype.removeGabrielPage = function() {
        this.menuModifier.setTransform(Transform.translate(0,0,0), { duration: 1 });
        this.pageModifier.setTransform(Transform.translate(window.innerHeight * 2, 0, 0), this.options.transition);
    };

    AppView.prototype.toggleGabrielMenu = function() {
        if (this.gabrielMenu) {
            console.log('move garielPage aside');
            this.menuModifier.setTransform(Transform.translate(0,0,0), { duration: 1 });
            this.moveGabrielPageAside();
            this.menuView.animateStrips();
        } else {
            console.log('show full Gariel Page');
            this.showFullGabrielPage();
            this.removeProfilePage();
            this.removeSettingsPage();
            this.removeStarredPage();
            // this.removeFeedbackPage();
        }
        this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showGabrielPage = function() {
        console.log('show full GarielPage');
        this.gabrielMenu = true;
        this.showFullGabrielPage();
        this.removeProfilePage();
        this.removeSettingsPage();
        this.removeStarredPage();
    };

    // SettingsView Toggle
    AppView.prototype.moveSettingsPageAside = function() {
        this.settingsModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.showFullSettingsPage = function() {
        this.settingsModifier.setTransform(Transform.translate(0, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.removeSettingsPage = function() {
        this.settingsModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.toggleSettingsMenu = function() {
        if (this.settingsMenu) {
            console.log('moves settingsPage aside');
            this.moveSettingsPageAside();
            this.menuView.animateStrips();
        } else {
            console.log('show full settingsPage');
            this.showFullSettingsPage();
            this.removeProfilePage();
            this.removeGabrielPage();
            this.removeStarredPage();
        }
        this.settingsMenu = !this.settingsMenu;
    };

    AppView.prototype.showSettingsPage = function() {
        console.log('show full settingsPage');
        this.settingsMenu = true;
        this.showFullSettingsPage();
        this.removeProfilePage();
        this.removeGabrielPage();
        this.removeStarredPage();
        // this.removeFeedbackPage();
    };

    // StarredView Toggle
    AppView.prototype.moveStarredPageAside = function() {
        this.starredModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.showFullStarredPage = function() {
        this.starredModifier.setTransform(Transform.translate(0, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.removeStarredPage = function() {
        this.starredModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.toggleStarredMenu = function() {
        if (this.starredMenu) {
            console.log('moves starredPage aside');
            this.moveStarredPageAside();
            this.menuView.animateStrips();
        } else {
            console.log('show full starredPage');
            this.showFullStarredPage();
            this.removeProfilePage();
            this.removeGabrielPage();
            this.removeSettingsPage();
        }
        this.starredMenu = !this.starredMenu;
    };

    AppView.prototype.showStarredPage = function() {
        console.log('show full starredPage');
        this.starredMenu = true;
        this.showFullStarredPage();
        this.removeProfilePage();
        this.removeGabrielPage();
        this.removeSettingsPage();
    };

    // FeedbackView Toggle
    AppView.prototype.moveFeedbackPageAside = function() {
        this.feedbackModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.showFullFeedbackPage = function() {
        this.feedbackModifier.setTransform(Transform.translate(0, 0, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.removeFeedbackPage = function() {
        this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), { duration: 0 } );
        this.feedbackModifier.setTransform(Transform.translate(0, window.innerHeight * 2, 0), {
            curve: 'easeOut',
            duration: 200
        });
    };

    AppView.prototype.toggleFeedback = function() {
        if (this.feedbackToggle) {
            this.removeFeedbackPage();
            this.menuView.animateStrips();
        } else {
            console.log('show full feedbackPage');
            this.showFullFeedbackPage();
        }
        this.feedbackToggle = !this.feedbackToggle;
    };

    AppView.prototype.showFeedbackPage = function() {
        this.pageModifier.setTransform(Transform.translate(window.innerWidth, 0, 0), { duration: 0 } );
        this.feedbackToggle = true;
        this.showFullFeedbackPage();
    };

    // MatchView Toggle
    AppView.prototype.slideRightMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(window.innerWidth * 2, 0, 0), {
            duration: 500,
            curve: Easing.outBack
        });
    };

    AppView.prototype.slideLeftMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(0, 0, 0), {
           duration: 300,
           curve: 'easeOut'
        });
    };

    AppView.prototype.toggleMatchView = function() {
        if (this.matchViewToggle) {
            this.slideRightMatchView();
        } else {
            this.slideLeftMatchView();
        }
        this.matchViewToggle = !this.matchViewToggle;
    };

    // Create different views
    function _createPageView() {
        this.pageView = new PageView({
            jobs: this.jobs
        });
        this.pageModifier = new StateModifier({
          transform: Transform.translate(0, 0, 0.1)
        });

        this.add(this.pageModifier).add(this.pageView);
    }


    function _createMenuView() {
        this.menuView = new MenuView({
            stripData: StripData
        });
        this.menuModifier = new StateModifier({
            transform: Transform.translate(-window.innerWidth, 0, 0)
        });

        this.add(this.menuModifier).add(this.menuView);
    }

    function _createMatchView() {
        this.matchView = new MatchView();
        this.matchModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        var matchModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.matchModifier)
            .add(matchModifier2)
            .add(this.matchView);
    }

    function _createSettingsView() {
        this.settingsView = new SettingsView();

        this.settingsModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        this.add(this.settingsModifier).add(this.settingsView);
    }

    function _createStarredView() {
        this.starredView = new StarredView();

        this.starredModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        this.add(this.starredModifier).add(this.starredView);
    }

    function _createProfileView() {
        this.profileView = new ProfileView();

        this.profileModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth * 2, 0, 0)
        });

        var profileModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.profileModifier).add(profileModifier2).add(this.profileView);
    }

    function _createFeedbackView() {
        this.feedbackView = new FeedbackView();

        this.feedbackModifier = new StateModifier({
            transform: Transform.translate(0, window.innerHeight * 2, 0)
        });

        var feedbackModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.feedbackModifier).add(feedbackModifier2).add(this.feedbackView);
    }

    function _createLandingView() {
        this.landingView = new LandingView();
        this.landingModifier = new StateModifier({
            transform: Transform.translate(0, 0, 1)
        })

        this.add(this.landingModifier).add(this.landingView);
    }


    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleGabrielMenu.bind(this));
        this.settingsView.on('menuToggle', this.toggleSettingsMenu.bind(this));
        this.starredView.on('menuToggle', this.toggleStarredMenu.bind(this));
        this.profileView.on('menuToggle', this.toggleProfileMenu.bind(this));

        this.feedbackView.on('feedbackToggle', this.toggleFeedback.bind(this));

        this.menuView.on('menuOnly', this.showGabrielPage.bind(this));
        this.menuView.on('settingsOnly', this.showSettingsPage.bind(this));
        this.menuView.on('starredOnly', this.showStarredPage.bind(this));
        this.menuView.on('feedbackOnly', this.showFeedbackPage.bind(this));
        this.menuView.on('profileOnly', this.showProfilePage.bind(this));

        this.pageView.on('matchViewToggle', this.toggleMatchView.bind(this));
        this.matchView.on('matchViewToggle', this.toggleMatchView.bind(this));
    }
    module.exports = AppView;
});
