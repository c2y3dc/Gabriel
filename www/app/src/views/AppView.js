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

    function AppView() {
        View.apply(this, arguments);


        this.gabrielMenu = true;
        this.settingsMenu = true;

        this.matchViewToggle = false;


        // this.settingsViewSlideToggle = false;
        this.pageViewPos = 0;

        _createPageView.call(this);
        _createMatchView.call(this);
        _createMenuView.call(this);
        _createSettingsView.call(this);

        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 300,
            curve: 'easeOut'
        }
    };

    // MenuView Toggle
    AppView.prototype.moveGabrielPageAside = function() {
        this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.showFullGabrielPage = function() {
        this.pageModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    AppView.prototype.removeGabrielPage = function() {
      this.pageModifier.setTransform(Transform.translate(window.innerHeight, 0, 0), this.options.transition);
    };

    AppView.prototype.toggleGabrielMenu = function() {
      console.log(this.gabrielMenu);
      if (this.gabrielMenu) {
        console.log('move garielPage aside');
        this.moveGabrielPageAside();
        this.menuView.animateStrips();
      } else {
        console.log('show full Gariel Page');
        this.showFullGabrielPage();
        this.removeSettingsPage();
      }
      this.gabrielMenu = !this.gabrielMenu;
    };

    AppView.prototype.showGabrielPage = function() {
      console.log('show full GarielPage');
      this.gabrielMenu = true;
      this.showFullGabrielPage();
      this.removeSettingsPage();
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
      this.settingsModifier.setTransform(Transform.translate(window.innerWidth, 0, 0), {
        curve: 'easeOut',
        duration: 200
      });
    };

    AppView.prototype.toggleSettingsMenu = function() {
      console.log('settingsMenu', this.settingsMenu);
      if (this.settingsMenu) {
        console.log('moves settingsPage aside');
        this.moveSettingsPageAside();
        this.menuView.animateStrips();
      } else {
        console.log('show full settingsPage');
        this.showFullSettingsPage();
        this.removeGabrielPage();
      }
      this.settingsMenu = !this.settingsMenu;
    };

    AppView.prototype.showSettingsPage = function() {
      console.log('show full settingsPage');
      this.settingsMenu = true;
      this.showFullSettingsPage();
      this.removeGabrielPage();
    };

    // MatchView Toggle
    AppView.prototype.slideRightMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(window.innerWidth, 0, 0), {
            method: 'spring',
            dampingRatio: 0.5,
            period: 900
        });
    };

    AppView.prototype.slideLeftMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(0, 0, 0), {
            method: 'wall',
            dampingRatio: 1.0,
            period: 500
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
        this.pageView = new PageView();
        this.pageModifier = new StateModifier();

        this.add(this.pageModifier).add(this.pageView);
    }

    function _createMenuView() {
        this.menuView = new MenuView({
            stripData: StripData
        });
        var menuModifier = new StateModifier({
            transform: Transform.behind
        });

        this.add(menuModifier).add(this.menuView);
    }

    function _createMatchView() {
        this.matchView = new MatchView();
        this.matchModifier = new StateModifier({
            transform: Transform.translate(window.innerWidth, 0, 0)
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
        transform: Transform.translate(window.innerWidth, 0, 0)
      });

      var settingsModifier2 = new StateModifier({
        // transform: Transform.inFront
      });

      this.add(this.settingsModifier).add(settingsModifier2).add(this.settingsView);
    }

    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleGabrielMenu.bind(this));
        this.menuView.on('menuOnly', this.showGabrielPage.bind(this));


        this.pageView.on('matchViewToggle', this.toggleMatchView.bind(this));
        this.matchView.on('matchViewToggle', this.toggleMatchView.bind(this));

        this.menuView.on('settingsOnly', this.showSettingsPage.bind(this));

        this.settingsView.on('menuToggle', this.toggleSettingsMenu.bind(this));

        this.menuView.on('starredOnly', this.showSettingsPage.bind(this));

        this.menuView.on('feedbackOnly', this.showSettingsPage.bind(this));

    }
    module.exports = AppView;
});
