if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

var StringParser = function (str) {
	var str = str.split(""), pstr = "", tmp;
	var len = str.length;
	for (var i = 0; i < len; i++) {
		if (str[i] !== "\\") {
			pstr += str[i];
		} else {
			i++;
			switch (tmp = str[i]) {
				case "\r": // 续行符 (Line continuation)
					if (str[i + 1] === "\n") ++i;
				break;
				case "\n": break; // 续行符 (Line continuation)
				case "0": pstr += "\x00"; break; // null
				case "a": pstr += "\x07"; break;
				case "b": pstr += "\x08"; break;
				case "e": pstr += "\x1b"; break;
				case "f": pstr += "\x0c"; break;
				case "n": pstr += "\x0a"; break; // 换行符
				case "r": pstr += "\x0d"; break;
				case "s": pstr += "\x20"; break; // space
				case "t": pstr += "\x09"; break; // Unicode 字符
				case "u":
					pstr += String.fromCharCode(parseInt(str[++i] + str[++i] + str[++i] + str[++i], 16));
				break;
				case "U":
					pstr += String.fromCodePoint(parseInt(str[++i] + str[++i] + str[++i] + str[++i] + str[++i] + str[++i] + str[++i] + str[++i], 16));
				case "v": pstr += "\x0b"; break;
				case "x": // 二进制字符
					pstr += String.fromCharCode(parseInt(str[++i] + str[++i], 16));
				break;
				default:
					pstr += tmp;
			}
		}
	}
	return pstr;
}

function __expr_eval__ (iexpr) {
	iexpr = "" + iexpr;
	var assigno = iexpr.indexOf("="), variname, // 要赋值的变量名
	tmp3 = iexpr.slice(0, assigno).trim();
	/^[A-Za-z\_\$][\w\$]*$/.test(tmp3) || (assigno = -1); // 遇到运算符就计算, 不赋值
	assigno > 0 && (variname = tmp3);
	var expr = iexpr.slice(assigno < 0 ? 0 : assigno + 1).split("");

	function factorial (n) { // 阶乘函数
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
		applyfunc2();
		var opr;
		while ((opr = ostk[optr]) === 7) {
			--optr;
			nstk[--nptr] = Math.pow(nstk[nptr], nstk[nptr + 1]);
		}
	}
	function applyfunc2 () {
		while ((opr = ostk[optr]) === 10) {
			--optr;
			nstk[--nptr] = nstk[nptr](nstk[nptr + 1]);
		}
		paptr === rtmp && (rawflag = false);
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
	var delarr = [">", "]",, "}", ")"];
	function matchdelim (chr) {
		return delarr[chr.charCodeAt(0) % 6];
	}
	function createq (rawf, fn) {
		while (expr[i] === " ") { // 跳过空格
			if (i >= len) return;
			i++;
		}
		var delim = expr[i], delim2 = /[\(\[\{<]/.test(delim) ? matchdelim(delim) : delim, // 设置定界符
		tmp = "", tmp2, lev = 1;
		for (;;) {
			i++;
			delim2 === (tmp2 = expr[i]) ? lev-- : delim === tmp2 && lev++;
			if (i >= len || lev <= 0) break;
			if (tmp2 === "\\") (tmp += "\\", tmp2 = expr[++i]);
			tmp += tmp2;
		}
		nstk[nptr] = fn((rawflag || rawf) ? tmp : StringParser(tmp), delim, delim2);
	}

	var nstk = [], ostk = [], pastk = [1], nptr = -1, optr = -1, paptr = 0, omode = true, numstr, ii, tmp, tmp2, tmp3, tmp4, terminator, rawflag, rtmp;
	// main:
	for (var i = 0, len = expr.length; i < len; ++i) {
		switch (expr[i]) {
			case '"': case "'":
				// if (!omode) {
				// 	throw "语法错误 (unexpected string)";
				// }
				tmp = "";
				terminator = expr[i];
				++i;
				while (i < len && expr[i] !== terminator) {
					if (expr[i] === "\\") (tmp += "\\", ++i);
					tmp += expr[i];
					++i;
				}
				if (omode) {
					nstk[++nptr] = rawflag ? tmp : StringParser(tmp);
				} else if (typeof (tmp2 = nstk[nptr]) === "function") {
					nstk[nptr] = tmp2((rawflag || tmp2.rawf) ? tmp : StringParser(tmp));
				} else {
					throw "语法错误 (unexpected string)";
				}
				omode = false;
			break;
			case "(":
				omode || (rawflag || (typeof (tmp = nstk[nptr]) === "function" && tmp.rawf && (rawflag = true, rtmp = paptr)), ostk[++optr] = 8);
				ostk[++optr] = 0;
				pastk[++paptr] = 1;
				omode = true;
			break;
			case ")":
				if (paptr <= 0) {
					throw "语法错误 (unexpected parenthesis)";
				}
				omode && pastk[paptr]--;
				concat();
				optr--; 
				nptr -= ((tmp = pastk[paptr--]) - 1);
				tmp === 0 && (nstk[nptr] = undefined);
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
				if (omode) {
					throw "语法错误 (unexpected *)";
				}
				calcpow(); calcsign(); calcmul();
				ostk[++optr] = 3;
				omode = true;
			break;
			case "/":
				if (omode) {
					throw "语法错误 (unexpected /)";
				}
				calcpow(); calcsign(); calcmul();
				ostk[++optr] = 4;
				omode = true;
			break;
			case "&":
				if (omode) {
					throw "语法错误 (unexpected &)";
				}
				concat();
				ostk[++optr] = 9;
				omode = true;
			break;
			case "^":
				if (omode) {
					throw "语法错误 (unexpected ^)";
				}
				applyfunc2();
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
			break;
			case "\\": // line continuation
				if (expr[++i] === "\n") break;
				// if (!omode) {
				// 	throw "语法错误";
				// }
				tmp = "";
				for (; i < expr.length && /[0-9A-Za-z\_\$]/.test(expr[i]); i++) {
					tmp += expr[i];
				}
				--i;
				if (omode) {
					nstk[++nptr] = tmp;
				} else if (typeof (tmp2 = nstk[nptr]) === "function") {
					tmp2 = tmp2(tmp);
				} else throw "语法错误";
				omode = false;
			break;
			case "0": case "1": case "2": case "3": case "4": case "5":
			case "6": case "7": case "8": case "9": case ".":
				// if (!omode) {
				//	throw "语法错误 (unexpected number)";
				// }
				tmp2 = omode;
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
				if (tmp2) {
					nstk[++nptr] = +numstr;
				} else if (typeof (tmp3 = nstk[nptr]) === "function"){
					nstk[nptr] = nstk[nptr](+numstr);
				} else throw "语法错误 (unexpected number)";
			break;
			default:
				numstr = "";
				if (!/[0-9A-Za-z\_\$]/.test(expr[i])) throw "不存在的运算符";
				for (; i < expr.length && /[0-9A-Za-z\_\$]/.test(expr[i]); i++) {
					numstr += expr[i];
				}
				--i;
				if (!omode) {
					ostk[++optr] = 10; // throw "语法错误 (unexpected identifier)";
					typeof (tmp = nstk[nptr]) === "function" && tmp.rawf && (rawflag = true, rtmp = paptr);
				}
				tmp3 = nstk[++nptr] = (tmp2 = __user_vars__["x" + numstr]) == null ? __variables__[numstr] : tmp2;
				typeof tmp3 === "function" && tmp3.quotf && createq(tmp3.rawf, tmp3, i++);
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
	quote: function (str) {
		return str;
	},
	eval: __expr_eval__
};
__variables__.raw.rawf = true
__variables__.quote.quotf = true