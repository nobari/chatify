function replaceAll(str, mapObj) {
  const regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  return str.replace(regex, key => mapObj[key]);
}

function replaceArabicToPersian(str) {
  let newStr = str;
  for (let i = 1611; i < 1632; i += 1) {
    newStr = newStr.replace(new RegExp(String.fromCharCode(i), 'g'), '');
  }

  const charMap = {
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
    '٩': '۹',
  };
  return replaceAll(newStr, charMap);
}

function replaceEnglishToPersian(str) {
  const charMap = {
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹',
  };
  return replaceAll(str, charMap);
}

function replacePersianToEnglish(str) {
  const charMap = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  return replaceAll(str, charMap);
}

function toPersian(input = "", {
  arabic = true,
  english = true,
} = {}) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  let result = String(input);
  if (arabic) {
    result = replaceArabicToPersian(result);
  }
  if (english) {
    result = replaceEnglishToPersian(result);
  }
  return result;
}

function toEnglish(input = "") {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  return replacePersianToEnglish(String(input));
}
var localIP;
const getLocalIp = () =>
  new Promise((r) => {
    try {
      window.RTCPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection; //compatibility for Firefox and chrome
      let pc = new RTCPeerConnection({ iceServers: [] }),
        noop = function () { };
      pc.createDataChannel(""); //create a bogus data channel
      (pc).createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
      pc.onicecandidate = function (ice) {
        if (ice && ice.candidate && ice.candidate.candidate) {
          let myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
            ice.candidate.candidate
          );
          if (myIP && myIP.length > 1) myIP = myIP[1];
          else myIP = undefined;
          // console.log("my IP: ", myIP);
          pc.onicecandidate = noop;
          return r(myIP);
        }
      };
    } catch (e) {
      console.log("no local ip:", e);
      r("errs");
    }
  });
window.boomiBasics = {
  toPersian, toEnglish, getLocalIp
}
getLocalIp().then(ip => localIP = ip);