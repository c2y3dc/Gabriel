// Keyboard
// - requires ionic keyboard plugin
try {
    // disable keyboard scrolling
    cordova.plugins.Keyboard.disableScroll(true);
} catch (err) {
    console.error(err, 'no Keyboard');
}
// add listeners for keyboard show/hide
window.addEventListener('native.keyboardhide', keyboardHideHandler);

function keyboardHideHandler(e) {
    console.log('Hidden Keyboard');
}


