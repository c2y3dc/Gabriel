/*globals require*/
require.config({
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        'oauth-js': '../lib/oauth-js/dist/oauth.min'
    },
    packages: [

    ]
});
require(['main']);
