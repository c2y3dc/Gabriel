define(function(require, exports, module) {

  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Easing = require('famous/transitions/Easing');
  var Transitionable = require('famous/transitions/Transitionable');
  var Modifier = require('famous/core/Modifier');

  var initialTime = Date.now();

  function LandingView() {
    View.apply(this, arguments);
    this.angel = {};
    
    _createBackground.call(this);
    _createLoginButton.call(this);
    _createRedirectButton.call(this);
    _createName.call(this);
    _createWings.call(this);

    _setListeners.call(this);
  }

  function _createBackground() {
    this.backgroundSurface = new Surface({
      properties: {
        backgroundColor: 'white'
      } 
    })
    this.rootModifier = new StateModifier ({
      transform: Transform.behind
    })
    this.root = this.add(this.rootModifier)
    this.root.add(this.backgroundSurface);
  }


  function _createWings() {
    this.leftWing = new ImageSurface({
      size: [window.innerWidth/2, window.innerHeight/1.2],
      content: 'img/leftwing.png'
    })
    this.rightWing = new ImageSurface({
      size: [window.innerWidth/2, window.innerHeight/1.2],
      content: 'img/rightwing.png'
    })
    this.leftWingModifier = new Modifier({
      origin: [1,0],
      transform: function(){
        return Transform.rotateY(-0.5*Math.cos(0.002*(Date.now()-initialTime))-0.8)
      }
    })
    this.rightWingModifier = new Modifier({
      origin: [0,0],
      transform: function(){
        return Transform.rotateY(0.5*Math.cos(0.002*(Date.now()-initialTime))+0.8)
      }
    })
    this.rightWingOffset = new StateModifier({
      transform: Transform.translate(15,0,0)
    })
    this.leftWingOffset = new StateModifier({
      transform: Transform.translate(-15,0,0)
    })
    this.wingModifier = new Modifier({
      align: [0.5, 0.05],
      transform: function(){
        return Transform.translate(0,(-30*Math.sin(0.002*(Date.now()-initialTime))),200)
      }
    })
    this.wingNode = this.root.add(this.wingModifier);
    this.wingNode.add(this.leftWingOffset).add(this.leftWingModifier).add(this.leftWing);
    this.wingNode.add(this.rightWingOffset).add(this.rightWingModifier).add(this.rightWing);
  }

  function _createName() {
    this.name = new Surface({
      size: [window.innerWidth/1.5, window.innerHeight/3],
      content: 'GABRIEL',
      classes: ['landing-name']
    })
    this.nameModifier = new StateModifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.4],
      transform: Transform.translate(0,0,300)
    })

    this.root.add(this.nameModifier).add(this.name);
  }

  function _createLoginButton() {
    this.loginButton = new Surface({
      size: [window.innerWidth/5,window.innerHeight/25],
      content: 'Sign In',
      classes: ['landing-buttons', 'login-button']

    })
    
    this.loginButtonModifier = new StateModifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.75],
      transform: Transform.translate(0,0,100)
    });

    this.root.add(this.loginButtonModifier).add(this.loginButton);
  }

  function _createRedirectButton() {
    this.redirectButton = new Surface({
      content: 'Get Started with Angel List',
      classes: ['landing-buttons', 'redirect-button']
      
    })

    this.redirectButtonModifier = new StateModifier({
      size: [window.innerWidth/1.8, window.innerHeight/25],
      origin: [0.5, 0.5],
      align: [0.5, 0.85],
      transform: Transform.inFront
    });

    this.root.add(this.redirectButtonModifier).add(this.redirectButton);
  }

  var opacityState = new Transitionable(1);

  function opacitateIn (duration){
    opacityState.set(1, {duration : duration || 0})
  }

  function opacitateOut (duration){
    opacityState.set(0, {duration : duration || 0})
  }

  function opacityToggle (duration){
    var currentOpacity = opacityState.get();
    if (currentOpacity > 0.5) opacitateIn(duration);
    else opacitateOut(duration);
  }

  function _setListeners() {
    this.loginButton.on('click', function() {
      //call oauth.io popup
      OAuth.initialize('8zrAzDgK9i-ryXuI6xHqjHkNpug');
      OAuth.popup('angel_list').done(function (result) {
        //puts our API object in options under key angel
        this.options.angel = result;
        result.get('/1/jobs').done(function (data) {
          //this is an example of how we use the result object, aka the API object
          console.log(data);
          //this doesn't fade quite the way I want it to
          this.rootModifier.setOpacity(0, opacitateOut(1000));
          //this totally works
          this.rootModifier.setTransform(Transform.translate(0,0,-10000));
          console.log('UPDATED AUTHED OPTIONS',this.options)
        }.bind(this)).fail(function (oops) {
          console.log('oops');
        }.bind(this));

      }.bind(this));

    }.bind(this));
  }

  LandingView.prototype = Object.create(View.prototype);
  LandingView.prototype.constructor = LandingView;



    module.exports = LandingView;
});
