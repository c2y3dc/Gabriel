define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var InputSurface = require('famous/surfaces/InputSurface');
    var TextareaSurface = require('famous/surfaces/TextareaSurface');

    function NoteView() {
        View.apply(this, arguments);
        _createNote.call(this);
        _setListeners.call(this);
    }

    NoteView.prototype = Object.create(View.prototype);
    NoteView.prototype.constructor = NoteView;

    NoteView.DEFAULT_OPTIONS = {};

    function _createNote() {


        this.input = new TextareaSurface({
            size: [window.innerWidth, window.innerHeight / 2],
            name: 'inputSurface',
            placeholder: 'Type note here',
            value: '',
            type: 'text',
            properties: {
                backgroundColor: '#34C9AB',
                padding: '1.3rem',
                border: 'none',
                color: 'white'
            }
        });

        this.inputMod = new StateModifier({
            opacity: 0.9
        })

        this.add(this.inputMod).add(this.input)

    }

    function _setListeners() {
        this.input.on('touchstart', function() {
            if (window.cordova) {
                native.keyboardshow
            }
        }.bind(this));
        //this.input.on('click', this.input)

    }

    module.exports = NoteView;
});
