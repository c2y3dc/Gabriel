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

    function AppView() {
        View.apply(this, arguments);
        this.menuToggle = false;
        this.matchViewToggle = false;
        this.pageViewPos = 0;

        this.cardViewPos = new Transitionable([0, 0]);

        _createPageView.call(this);
        _createMatchView.call(this);
        _createMenuView.call(this);
        _setListeners.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        slideLeftX: window.innerWidth - window.innerWidth / 8,
        transition: {
            duration: 500,
            curve: Easing.inOutBack
        }
    };

    AppView.prototype.toggleMatchView = function() {
        if (this.matchViewToggle) {
            this.slideRightMatchView();
        } else {
            this.slideLeftMatchView();
            //this.menuView.animateStrips();
        }
        this.matchViewToggle = !this.matchViewToggle;

    };

    AppView.prototype.toggleMenu = function() {
        if (this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateStrips();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppView.prototype.slideRight = function() {
        this.pageModifier.setTransform(Transform.translate(this.options.slideLeftX, 0, 0), this.options.transition);
    };

    AppView.prototype.slideLeft = function() {
        this.pageModifier.setTransform(Transform.translate(0, 0, 0), this.options.transition);
    };

    AppView.prototype.slideRightMatchView = function() {
        this.matchModifier.setTransform(Transform.translate(2 * window.innerWidth, 0, 0), {
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
            transform: Transform.translate(2 * window.innerWidth, 0, 0)
        });

        var matchModifier2 = new StateModifier({
            transform: Transform.inFront
        });

        this.add(this.matchModifier)
            .add(matchModifier2)
            .add(this.matchView);
    }

    function _setListeners() {
        this.pageView.on('menuToggle', this.toggleMenu.bind(this));
        this.pageView.on('matchViewToggle', this.toggleMatchView.bind(this));
        this.matchView.on('matchViewToggle', this.toggleMatchView.bind(this));
    }

    module.exports = AppView;
});
