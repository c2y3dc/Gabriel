function truncate(str, n) {
    if (str && str.length > 0)
        return str.length > n ? str.substr(0, n - 1) : str;
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

function jobTags(tags, num) {
    if (tags && tags != '') {
        return tags.slice(0, num).join(', ');
    } else {
        return 'No skills provided'
    }
}

function fontReSize(length) {
    if (length > 50) {
        return '10px';
    } else if (length > 40) {
        return '12px';
    } else if (length > 30) {
        return '14px';
    } else if (length > 20) {
        return '16px';
    } else {
        return '20px';
    }
}

function textResize(id) {
    var container = "#" + id;
    console.log(container);
    while ($(container).find("span").width() > $(container).width()) {
        var currentFontSize = parseInt($(container).find("span").css("font-size"));
        $(container).find("span").css("font-size", currentFontSize - 1);
        console.log(currentFontSize);
    }
}

function newLine2Break(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br /><br />' : '<br><br>';
    return  str.replace(/[\r\n]{1,}/g, breakTag);
}

function stripNewLines(str){
    return str.replace(/[\r\n]{1,}/g, "<br /><br />");
}
