function truncate(str, n) {
    if (str)
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
