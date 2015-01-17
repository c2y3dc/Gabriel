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

        if(result){
            Promise.resolve(result)
            .then(function(){
                console.log('calling _OAuthCreation')
                _OAuthCreation.call(this);
            }.bind(this))
            .catch(function(err){
                 _OAuthCreation.call(this);
            }.bind(this))
        }
    }

    function _OAuthCreation() {
            
            OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
            OAuth.popup('angel_list', {
                cache: true
            }).done(function(result) {
                //this event triggers splash page:
               
                    this._eventOutput.emit('loggedin');
                
                this.rootModifier.setTransform(Transform.translate(-window.innerWidth * 2, 0, 0), {
                    duration: 500
                });
                this.options.angel = result;
                ANGEL = result;
                _userQuery.call(this);

            }.bind(this));
    }

    function _userQuery() {
        console.log('in _jobQuery')
        
        this.options.angel.get('/1/me').done(function(data) {
            this.options.userData = data;
            console.log('USERDATA', this.options.userData)
            
            this.options.userData.locations.forEach(function(loc){
                this.options.userLoc.push(loc.id);
            }.bind(this));
            
            this.options.userData.skills.forEach(function(skill){
                this.options.userSkills.push(skill.id);
            }.bind(this));

            _jobQuery.call(this);
                    
        }.bind(this)).fail(function(oops) {
            alert('fucketyfuck')
            window.location.reload();
        }.bind(this));
    }

    function _jobQuery() {
        if (this.options.userLoc.length === 0) this.options.userLoc = [1692];
        var locCount = 0;
        this.options.userLoc.forEach(function(id){
            this.options.angel.get('/1/tags/'+id+'/jobs', {data:{page:this.options.pageCount}}).done(function(data){
                locCount++
                data.jobs.forEach(function(job){
                    var notPushed = true;
                    job.tags.forEach(function(skill){
                        if(notPushed && this.options.userSkills.indexOf(skill.id) !== -1){
                            notPushed = false;
                            this.options.jobs[this.options.index] = job;
                            this.options.index++;
                        }
                    }.bind(this));
                }.bind(this));
            
                if(locCount == this.options.userLoc.length) {

                    if(this.options.index > 25) {
                        console.log('LockedAndLoaded')
                        this._eventOutput.emit('loaded');          
                    }else{
                        this.options.pageCount++;
                        _jobQuery.call(this);
                    }       
                    if(this.options.jobs.length===0){alert('Sorry but there are no jobs in your area for your skills')}
                }
            }.bind(this));
                    
        }.bind(this))
    }




    function _setListeners() {
        this.loginButton.on('click', function() {
            //call oauth.io popup
            _OAuthCreation.call(this);
        }.bind(this));
    }
    module.exports = LandingView;
});
