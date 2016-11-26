function __expr_eval__ (iexpr) {
	iexpr = "" + iexpr;
	var assigno = iexpr.indexOf("="), variname, tmp3 = iexpr.slice(0, assigno).trim();
	/^[A-Za-z\_\$][\w\$]*$/.test(tmp3) || (assigno = -1);
	assigno > 0 && (variname = tmp3);
	var expr = iexpr.slice(assigno < 0 ? 0 : assigno + 1).split("");

	var StringParser = function (str) {
		var str = str.split(""), pstr = "", tmp;
		var len = str.length;
		for (var i = 0; i < len; i++) {
			if (str[i] !== "\\") {
				pstr += str[i];
			} else {
				i++;
				switch (tmp = str[i]) {
					case "\r": // Line continuation
						if (str[i + 1] === "\n") ++i;
					break;
					case "\n": break; // Line continuation
					case "0": pstr += "\x00"; break;
					case "a": pstr += "\x07"; break;
					case "b": pstr += "\x08"; break;
					case "e": pstr += "\x1b"; break;
					case "f": pstr += "\x0c"; break;
					case "n": pstr += "\x0a"; break;
					case "r": pstr += "\x0d"; break;
					case "t": pstr += "\x09"; break;
					case "u":
						pstr += String.fromCharCode(parseInt(str[++i] + str[++i] + str[++i] + str[++i], 16));
					break;
					case "v": pstr += "\x0b"; break;
					case "x":
						pstr += String.fromCharCode(parseInt(str[++i] + str[++i], 16));
					break;
					default:
						pstr += tmp;
				}
			}
		}
		return pstr;
	}
	function factorial (n) {
		var m = 1;
		for (var i = 2; i <= n; i++) m *= i;
		return m;
	}
	function calcsign () {
		for (;;) {
			var opr = ostk[optr];
			if (opr === 5) {
				nstk[nptr] = +nstk[nptr];
			} else if (opr === 6) {
				nstk[nptr] = -nstk[nptr];
			} else break;
			--optr;
		}
	}
	function calcplus () {
		var opr = ostk[optr];
		if (opr === 1) {
			--nptr;--optr;
			return nstk[nptr] = +nstk[nptr] + +nstk[nptr + 1];
		};
		if (opr === 2) {
			--nptr;--optr;
			return nstk[nptr] = nstk[nptr] - nstk[nptr + 1];
		};
	}
	function calcmul () {
		var opr = ostk[optr];
		if (opr === 3) {
			--nptr;--optr;
			return nstk[nptr] = nstk[nptr] * nstk[nptr + 1];
		};
		if (opr === 4) {
			--nptr;--optr;
			return nstk[nptr] = nstk[nptr] / nstk[nptr + 1];
		};
	}
	function calcpow () {
		for (;;) {
			var opr = ostk[optr];
			if (opr === 7) {
				--nptr;--optr;
				nstk[nptr] = Math.pow(nstk[nptr], nstk[nptr + 1]);
			} else break;
		}
	}
	function concat () {
		calcpow(); calcsign(); calcmul(); calcplus();
		if (ostk[optr] !== 9) return;
		--nptr;--optr;
		return nstk[nptr] = "" + nstk[nptr] + nstk[nptr + 1];
	}
	function applyfunc (args) {
		if (ostk[optr] !== 8) return;
		--optr;
		var arr = [], tmp;
		for (var i = 0; i < args; ++i) {
			arr[i] = nstk[nptr + i];
		}
		var j = nptr - 1;
		var type = typeof (tmp = nstk[j]);
		if (type === "function")
			nstk[j] = tmp.apply(null, arr);
		else
			nstk[j] = tmp * nstk[nptr];
		nptr = j;
	}

	var nstk = [], ostk = [], pastk = [1], nptr = -1, optr = -1, paptr = 0, omode = true, numstr, ii, tmp, tmp2, terminator, rawflag, rtmp;
	// main:
	for (var i = 0, len = expr.length; i < len; ++i) {
		switch (expr[i]) {
			case '"': case "'":
				tmp = "";
				terminator = expr[i];
				++i;
				while (i < len && expr[i] !== terminator) {
					if (expr[i] === "\\") (tmp += "\\", ++i);
					tmp += expr[i];
					++i;
				}
				nstk[++nptr] = rawflag ? tmp : StringParser(tmp);
				omode = false;
			break;
			case "(":
				omode || (rawflag || (nstk[nptr].rawf && (rawflag = true, rtmp = paptr)), ostk[++optr] = 8);
				ostk[++optr] = 0;
				pastk[++paptr] = 1;
				omode = true;
			break;
			case ")":
				omode && pastk[paptr]--;
				concat();
				optr--; 
				nptr -= ((tmp = pastk[paptr--]) - 1);
				applyfunc(tmp);
				paptr === rtmp && (rawflag = false);
				omode = false;
			break;
			case "!":
				nstk[nptr] = factorial(nstk[nptr]);
				omode = false;
			break;
			case "+":
				if (omode) {
					ostk[++optr] = 5;
				} else {
					calcpow(); calcsign(); calcmul(); calcplus();
					ostk[++optr] = 1;
					omode = true;
				}
			break;
			case "-":
				if (omode) {
					ostk[++optr] = 6;
				} else {
					calcpow(); calcsign(); calcmul(); calcplus();
					ostk[++optr] = 2;
					omode = true;
				}
			break;
			case "*":
				calcpow(); calcsign(); calcmul();
				ostk[++optr] = 3;
				omode = true;
			break;
			case "/":
				calcpow(); calcsign(); calcmul();
				ostk[++optr] = 4;
				omode = true;
			break;
			case "&":
				 concat();
				ostk[++optr] = 9;
				omode = true;
			break;
			case "^":
				ostk[++optr] = 7;
				omode = true;
			break;
			case ",":
				omode && (nstk[++nptr] = null);
				concat();
				pastk[paptr]++;
				omode = true;
			break;
			case " ": case "\t": case "\r": case "\n": // spaces
			case "\\": // line continuation
			break;
			case "0": case "1": case "2": case "3": case "4": case "5":
			case "6": case "7": case "8": case "9": case ".":
				omode = false;
				numstr = expr[i];
				for (;;) {
					ii = i + 1;
					if ((tmp = expr[ii]) && /[\d\.]/.test(tmp)) {
						numstr += expr[ii];
						i = ii;
					} else if (tmp === "e" || tmp === "E") {
						numstr += "e" + expr[ii + 1];
						i += 2;
					} else break;
				}
				nstk[++nptr] = +numstr;
			break;
			default:
				numstr = "";
				if (!/[0-9A-Za-z\_\$]/.test(expr[i])) throw "不存在的运算符";
				for (; i < expr.length && /[0-9A-Za-z\_\$]/.test(expr[i]); i++) {
					numstr += expr[i];
				}
				--i;
				nstk[++nptr] = (tmp2 = __user_vars__["x" + numstr]) == null ? __variables__[numstr] : tmp2;
				omode = false;
		}
	}
	concat();

	variname != null && (__user_vars__["x" + variname] = nstk[0]);
	return nstk[0];
}
	
var __user_vars__ = {};
var __variables__ = {
	raw: function (str) {
		return str;
	},
	eval: __expr_eval__
};
__variables__.raw.rawf = true