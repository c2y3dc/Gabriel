define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MatchView() {
        View.apply(this, arguments);
    }

    MatchView.prototype = Object.create(View.prototype);
    MatchView.prototype.constructor = MatchView;

    MatchView.DEFAULT_OPTIONS = {};

    module.exports = MatchView;
});
