var b64enc1 = function (str) {
	var b64core = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
	str = "" + str;
	var remain, newstr = "";
	var arrb = new ArrayBuffer(remain = str.length + 1);
	var arri8 = new Uint8Array(arrb);
	var base = (Math.random()*256)|0;
	arri8[0] = base;
	for (var i = str.length - 1; i >= 0; i--) {
		arri8[i+1] = str.charCodeAt(i) ^ base;
	}
	for (var i = 0, j = 0, k = remain; k > 0; i += 3, j += 4, k -= 3) {
		switch (k) {
			case 1:
				newstr += b64core[arri8[i] >> 2] + b64core[(arri8[i] << 4) & 63];
			break;
			case 2:
				newstr += b64core[arri8[i] >> 2] + b64core[((arri8[i] << 4) | (arri8[i+1] >> 4)) & 63] + b64core[(arri8[i+1] << 2) & 63];
			break;
			default:
				newstr += b64core[arri8[i] >> 2] + b64core[((arri8[i] << 4) | (arri8[i+1] >> 4)) & 63] + b64core[((arri8[i+1] << 2) | (arri8[i+2] >> 6)) & 63] + b64core[arri8[i+2] & 63];
			break;
		}
	}
	return newstr;
}
var b64dec1 = function (str) {
    var db64c = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,63,-1,-1,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,62,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1];
	var newstr = "", len = str.length, base = (db64c[str.charCodeAt(0)] << 2) | (db64c[str.charCodeAt(1)] >> 4);
	for (var i = 1, rem = len - 2; rem > 0;) {
		// if (rem > 0) {
			rem--; newstr += String.fromCharCode((((db64c[str.charCodeAt(i)] << 4) | (db64c[str.charCodeAt(++i)] >> 2)) & 255) ^ base);
		// }
		if (rem > 0) {
			rem--; newstr += String.fromCharCode((((db64c[str.charCodeAt(i)] << 6) | db64c[str.charCodeAt(++i)]) & 255) ^ base); ++i;
		}
		if (rem > 1) {
			rem -= 2; newstr += String.fromCharCode((((db64c[str.charCodeAt(i)] << 2) | (db64c[str.charCodeAt(++i)] >> 4)) & 255) ^ base);
		}
	}
	return newstr;
}