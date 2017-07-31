function $(e) {
	return document.getElementById(e)
}
function encodeB26 (str) {
	str = str.split("");
	var len = str.length, str2 = "", cc, rem, quo, tmp
	enclist = "abcdefghijklmnopqrstuvwxyz".split("");
	for (var i = 0; i < len; i++) {
		cc = str[i].charCodeAt(0);
		switch (true) {
			case cc ===  32: str2 += "a"; break;
			case cc ===  10: str2 += "b"; break;
			case cc <   260:
				str2 += enclist[2 + (cc / 26) | 0] + enclist[cc % 26];
			break;
			case cc <  7488:
				rem = cc % 26; quo = (cc / 26 - 10) | 0; tmp = enclist[rem];
				str2 += enclist[12 + (quo / 26) | 0] + enclist[quo % 26] + tmp;
			break;
			default:
				rem = cc % 26; quo = (cc / 26 - 2) | 0; tmp = enclist[rem];
				rem = quo % 26; quo = (quo / 26 + 7) | 0; tmp = enclist[rem] + tmp;
				str2 += enclist[22 + (quo / 26) | 0] + enclist[quo % 26] + tmp;
				// console.debug(rem, quo, tmp);
		}
		// debugger;
	}
	return str2;
}
function decodeB26 (str) {
	str = str.split("");
	var len = str.length, str2 = "", cc, tmp, tmp2, tmp3;
	for (var i = 0; i < len;) {
		tmp = (str[i++].charCodeAt(0) - 1) % 32;
		if (tmp === 0) {
			str2 += " ";
		} else if (tmp === 1) {
			str2 += "\n";
		} else {
			tmp = tmp * 26 + (str[i++].charCodeAt(0) - 1) % 32;
			if (tmp < 312) str2 += String.fromCharCode(tmp - 52); else {
				tmp2 = (str[i++].charCodeAt(0) - 1) % 32;
				if (tmp < 590) {
					str2 += String.fromCharCode(tmp * 26 + tmp2 - 7852);
				} else {
					tmp3 = (str[i++].charCodeAt(0) - 1) % 32;
					str2 += String.fromCharCode(tmp * 676 + tmp2 * 26 + tmp3 - 391352);
				}
			}
		}
	}
	return str2;
}
if (typeof __variables__ !== 'undefined') {
	__variables__.encodez = encodeB26;
	__variables__.decodez = decodeB26;
}
