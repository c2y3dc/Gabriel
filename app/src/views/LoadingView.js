define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function LoadingView() {
        View.apply(this, arguments);
        _createLoadingPage.call(this);
    }

    LoadingView.prototype = Object.create(View.prototype);
    LoadingView.prototype.constructor = LoadingView;

    LoadingView.DEFAULT_OPTIONS = {};

    function _createLoadingPage() {

        this.bodySurface = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FDFDFD'
            }
        });
        
        this.bodyModifier = new StateModifier({
            transform: Transform.translate(0, 0, 201)
        });
        // this.node.add(this.bodyModifier).add(this.bodySurface);
        this.add(this.bodyModifier).add(this.bodySurface);

    }

    module.exports = LoadingView;
});
