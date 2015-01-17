define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function LandingView() {
        View.apply(this, arguments);
        this.angel = {};

        _createBackground.call(this);
        _createLoginButton.call(this);
        _createName.call(this);
        _createTagLine.call(this);
        _setListeners.call(this);
        _signIn.call(this);
    }

    LandingView.prototype = Object.create(View.prototype);
    LandingView.prototype.constructor = LandingView;

    LandingView.DEFAULT_OPTIONS = {
        width: window.innerWidth,
        height: window.innerHeight,
        angel: {},
        initialData: {},
        jobs: {},
        userLoc: [],
        userSkills: [],
        toBeLoggedIn: true,
        index: 0,
        pageCount: 1
    };

    function _createBackground() {
        this.backgroundSurface = new Surface({
            properties: {
                background: 'url("img/grey.png") repeat top right'
            }
        });

        this.rootModifier = new StateModifier({
            transform: Transform.translate(0, 0, 200)
        });

        this.root = this.add(this.rootModifier);
        this.root.add(this.backgroundSurface);
    }

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
        });

        this.nameModifier = new StateModifier({
            origin: [0, 0.5],
            align: [0.1, 0.5],
        });
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
        });
        this.tagLineModifier = new StateModifier({
            transform: Transform.translate(this.options.width * 0.11, this.options.height * 0.01, 0),
            origin: [0, 0],
            align: [0, 0.5]
        });

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
                fontWeight: 600,
                backgroundColor: 'rgba(250, 250, 250, .4)'
            }
        });
        this.loginButtonModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.70],
        });
        this.root.add(this.loginButtonModifier).add(this.loginButton);
    }

    function _signIn() {
        result = OAuth.create('angel_list')
            // return result ? Promise.resolve(result) : OAuth.popup('angel')
        if (result) {

            Promise.resolve(result)
                .then(function() {
                    _OAuthCreation.call(this);
                }.bind(this))
                .catch(function() {
                    _OAuthCreation.call(this);
                }.bind(this))

        }
    }

    function _OAuthCreation() {
        if (this.options.index > 100) {
            console.log('returning')
            return;
        }
        OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
        OAuth.popup('angel_list', {
            cache: true
        }).done(function(result) {
            //this event triggers splash page:
            if (this.options.toBeLoggedIn) {
                this._eventOutput.emit('loggedin');
                this.options.toBeLoggedIn = false;
            }
            this.rootModifier.setTransform(Transform.translate(-window.innerWidth * 2, 0, 0), {
                duration: 500
            });
            this.options.angel = result;
            ANGEL = result;
            result.get('/1/me').done(function(data) {
                this.options.userData = data;
                ME = data;
                this.options.userData.locations.forEach(function(loc) {
                    this.options.userLoc.push(loc.id);
                }.bind(this));
                this.options.userData.skills.forEach(function(skill) {
                    this.options.userSkills.push(skill.id);
                }.bind(this));
                if (this.options.userLoc.length === 0) this.options.userLoc = [1692];
                var locCount = 0;
                this.options.userLoc.forEach(function(id) {
                        ANGEL.get('/1/tags/' + id + '/jobs', {
                            data: {
                                page: this.options.pageCount
                            }
                        }).done(function(data) {
                            console.log("NEWPAGENEWPAGE, this.options.pageCount")
                            locCount++
                            data.jobs.forEach(function(job) {
                                console.log(this.options.userSkills, "USER SKILLS");
                                var notPushed = true;
                                job.tags.forEach(function(skill) {
                                    console.log(skill.id, "JOB SKILL ID");
                                    if (notPushed && this.options.userSkills.indexOf(skill.id) !== -1) {
                                        notPushed = false;
                                        console.log('in the if block MATCHMATCHMATCH', this.options.index);
                                        this.options.jobs[this.options.index] = job;
                                        this.options.index++;
                                    }

                                }.bind(this));

                            }.bind(this));
                            console.log('In the loop')

                            if (locCount == this.options.userLoc.length) {

                                console.log("matched jobs count: ", this.options.index + 1);
                                if (this.options.index > 100) {
                                    console.log('LockedAndLoaded')
                                    this._eventOutput.emit('loaded');
                                    return;
                                } else {
                                    this.options.pageCount++;
                                    _OAuthCreation.call(this);
                                }
                                if (this.options.jobs.length === 0) {
                                    alert('Sorry but there are no jobs in your area for your skills')
                                }
                            }
                            // console.log(this.options.jobs);
                        }.bind(this));

                    }.bind(this))
                    // console.log(this.options.userData);
            }.bind(this)).fail(function(oops) {
                console.log('unable to get user data');
                window.location.reload();
            }.bind(this));

        }.bind(this));
    }


    function _setListeners() {
        this.loginButton.on('click', function() {
            //call oauth.io popup
            _OAuthCreation.call(this);
        }.bind(this));
    }
    module.exports = LandingView;
});
