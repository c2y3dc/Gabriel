function truncate(str, n) {
    if (str && str.length > 0)
        return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
    else
        return 'No Description'
}

function capitalizeFirst(str) {
  var lower = str.toLowerCase();
  if (str === 'full-time') {
    lower = 'full time'
  }
  return lower.replace(/(^| )(\w)/g, function(x) {
    return x.toUpperCase();
  });
}

function salaryFormat(n, m) {
    if (n && m) {
        with(Math) {
            var base = floor(log(abs(n)) / log(1000));
            var suffix = 'kmb' [base - 1];
            var salaryConnect = '$' + String(n / pow(1000, base)).substring(0, 3) + ' - $' + String(m / pow(1000, base)).substring(0, 3) + suffix + ' Salary';
            return suffix ? salaryConnect : '$' + n + ' - $' + m;
        }
    } else {
        return 'Unknown salary';
    }
}

function equityFormat(min, max) {
    if (min, max) {
        return min + '% - ' + max + '% Equity';
    } else {
        return 'Unknown equity';
    }
}

function exitApp() {
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
    } else if (navigator.device && navigator.device.exitApp) {
        navigator.device.exitApp();
    }
}
