define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer = require('famous/utilities/Timer');
    var Surface = require('famous/core/Surface');

    var MenuHeaderView = require('views/MenuHeaderView');

    function MenuView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createMenuHeader.call(this);

        _setListeners.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        userData: {},
        headerSize: window.innerHeight * 0.44,
        stripData: {},
        angle: -0.2,
        stripWidth: window.innerWidth * 2,
        stripHeight: 54,
        topOffset: window.innerHeight * 0.47,
        stripOffset: 57,
        staggerDelay: 35,
        transition: {
            duration: 400,
            curve: 'easeOut'
        },
        landingView: undefined
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                classes: ['hello'],
                backgroundColor: '#F4F4F4'
            }
        });
        this.add(backing);
    }

    function _createMenuHeader() {
        this.menuHeaderView = new MenuHeaderView({
            user: this.options.userData,
            landingView: this.options.landingView
        });

        this.add(this.menuHeaderView);
    }


    function _setListeners() {
        this.menuHeaderView.logoutButton.on('signoutClicked', function() {
            console.log('signoutClicked');
            this._eventOutput.emit('signoutClicked');
        }.bind(this));
        // Menu surface
        //

        // this.menuHeaderView.cancelSurface.on('click', function(e) {
        //     if (e.detail !== null) return false;
        // }.bind(this));

        this.menuHeaderView.cancelTouchSurface.on('touchstart', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));



    }
    module.exports = MenuView;
});
