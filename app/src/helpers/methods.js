function truncate(str, n) {
    if (str && str.length > 0)
        return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
    else
        return 'No Description'
}


function format(n) {
    if (n) {
        with(Math) {
            var base = floor(log(abs(n)) / log(1000));
            var suffix = 'kmb' [base - 1];
            return suffix ? String(n / pow(1000, base)).substring(0, 3) + suffix : '' + n;
        }
    } else {
        return 'Unknown';
    }
}

function exitApp() {
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
    } else if (navigator.device && navigator.device.exitApp) {
        navigator.device.exitApp();
    }
}
