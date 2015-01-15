define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var InputSurface = require('famous/surfaces/InputSurface');
    var TextareaSurface = require('famous/surfaces/TextareaSurface');
    var SubmitInputSurface = require('famous/surfaces/SubmitInputSurface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Easing = require('famous/transitions/Easing');

    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var FormContainerSurface = require('famous/surfaces/FormContainerSurface');

    function NoteView() {
        View.apply(this, arguments);
        //_createBackground.call(this);
        _createNote.call(this);
        _createCancelButton.call(this);
        _createSubmitButton.call(this);
        _setListeners.call(this);
    }

    NoteView.prototype = Object.create(View.prototype);
    NoteView.prototype.constructor = NoteView;

    NoteView.DEFAULT_OPTIONS = {
        note: ''
    };

    // function _createBackground() {
    //     this.rootModifier = new StateModifier({
    //         size: [undefined, undefined],
    //         properties: {
    //             backgroundColor: 'white'
    //         }
    //     });

    //     this.mainNode = this.add(this.rootModifier);
    // }


    function _createNote() {

        this.inputSurface = new TextareaSurface({
            size: [window.innerWidth, window.innerHeight],
            name: 'textareaSurface',
            placeholder: 'Type note here',
            value: '',
            type: 'text',
            classes: ['create-note'],
            properties: {
              padding: '28% 10%'
            }
        });

        this.inputMod = new StateModifier({
            opacity: 0.95
        });

        // // this.cancelSurface = new ImageSurface({
        // //     size: [28, 28],
        // //     content: 'img/cancel.svg'
        // // });

        // // var menuModifier = new StateModifier({
        // //     transform: Transform.translate(this.options.width * 0.05, this.options.height * 0.05, 1),
        // //     origin: [0, 0],
        // //     align: [0, 0]
        // // })

        // this.node.add(menuModifier).add(this.cancelSurface);
        this.add(this.inputMod).add(this.inputSurface);
    }


    function _createCancelButton() {

        this.cancelButtonSurface = new ImageSurface({  
            classes: ['cancel-button'],
            size: [25, 25],
            content: 'img/cancel.svg' 
        });    
         
        this.cancelButtonMod = new StateModifier({
            align: [1, -0.1],
            origin: [1, 0]
        });

        this.add(this.cancelButtonMod).add(this.cancelButtonSurface);
    }

    function _createSubmitButton() {

        this.submitButtonSurface = new Surface({  
            classes: ['submit-button'],
               
            size: [undefined, true],
            content: 'SEND'   
        });     
        this.submitButtonMod = new StateModifier({
            align: [0, 1],
            origin: [0, 0]
        });

        this.add(this.submitButtonMod).add(this.submitButtonSurface);
    }


    function _setListeners() {

        this.inputSurface.on('touchstart', function() {

            if (window.cordova) {
                native.keyboardshow
            }

        }.bind(this));
        //this.input.on('click', this.input)
        // this.cancelSurface.on('touchstart', function() {
        //     if (window.cordova) {
        //         native.keyboardhide;
        //         this.inputMod.setTransform(Transform.translate(0, this.options.height * 2, 0), {
        //             curve: 'easeOut',
        //             duration: 400
        //         }, function() {

        //         }.bind(this));

        //         return this.inputMod;
        //     }
        // }.bind(this));
    }

    module.exports = NoteView;
});
