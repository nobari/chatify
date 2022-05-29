"use strict";

function replaceAll(str, mapObj) {
    var regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    return str.replace(regex, function (key) {
        return mapObj[key];
    });
}

function replaceArabicToPersian(str) {
    var newStr = str;

    for (var i = 1611; i < 1632; i += 1) {
        newStr = newStr.replace(new RegExp(String.fromCharCode(i), 'g'), '');
    }

    var charMap = {
        ي: 'ی',
        ى: 'ی',
        ك: 'ک',
        '٠': '۰',
        '١': '۱',
        '٢': '۲',
        '٣': '۳',
        '٤': '۴',
        '٥': '۵',
        '٦': '۶',
        '٧': '۷',
        '٨': '۸',
        '٩': '۹'
    };
    return replaceAll(newStr, charMap);
}

function replaceEnglishToPersian(str) {
    var charMap = {
        0: '۰',
        1: '۱',
        2: '۲',
        3: '۳',
        4: '۴',
        5: '۵',
        6: '۶',
        7: '۷',
        8: '۸',
        9: '۹'
    };
    return replaceAll(str, charMap);
}

function replacePersianToEnglish(str) {
    var charMap = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9'
    };
    return replaceAll(str, charMap);
}

function toPersian() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$arabic = _ref.arabic,
        arabic = _ref$arabic === void 0 ? true : _ref$arabic,
        _ref$english = _ref.english,
        english = _ref$english === void 0 ? true : _ref$english;

    if (typeof input !== 'string' && typeof input !== 'number') {
        throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
    }

    var result = String(input);

    if (arabic) {
        result = replaceArabicToPersian(result);
    }

    if (english) {
        result = replaceEnglishToPersian(result);
    }

    return result;
}

function toEnglish() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    if (typeof input !== 'string' && typeof input !== 'number') {
        throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
    }

    return replacePersianToEnglish(String(input));
}

var localIP = "";

var getLocalIp = function getLocalIp() {
    return new Promise(function (r) {
        try {
            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for Firefox and chrome

            var pc = new RTCPeerConnection({
                iceServers: []
            }),
                noop = function noop() { };

            pc.createDataChannel(""); //create a bogus data channel

            pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description

            pc.onicecandidate = function (ice) {
                if (ice && ice.candidate && ice.candidate.candidate) {
                    var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
                    if (myIP && myIP.length > 1) myIP = myIP[1]; else myIP = undefined; // console.log("my IP: ", myIP);

                    pc.onicecandidate = noop;
                    return r(myIP);
                }
            };
        } catch (e) {
            console.log("no local ip:", e);
            r("errs");
        }
    });
};

window.boomiBasics = {
    toPersian: toPersian,
    toEnglish: toEnglish,
    getLocalIp: getLocalIp
};
getLocalIp().then(function (ip) {
    return localIP = ip;
});