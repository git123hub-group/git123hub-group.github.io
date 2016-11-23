function __expr_eval__ (expr) {
	expr = expr.split("");

	var StringParser = function (str) {
		var str2 = str.split(""), pstr = "", tmp;
		var len = str2.length;
		for (var i = 0; i < len; i++) {
			if (str2[i] !== "\\") {
				pstr += str2[i];
			} else {
				i++;
				switch (tmp = str2[i]) {
					case "0": str2 += "\x00"; break;
					case "a": str2 += "\x07"; break;
					case "b": str2 += "\x08"; break;
					case "e": str2 += "\x1b"; break;
					case "f": str2 += "\x0c"; break;
					case "n": str2 += "\x0a"; break;
					case "r": str2 += "\x0d"; break;
					case "t": str2 += "\x09"; break;
					case "u":
						pstr += String.fromCharCode(parseInt(str2[++i] + str2[++i] + str2[++i] + str2[++i], 16));
					break;
					case "v": str2 += "\x0b"; break;
					case "x":
						pstr += String.fromCharCode(parseInt(str2[++i] + str2[++i], 16));
					break;
					default:
						pstr += tmp;
				}
			}
		}
		return {
			raw: str,
			toString: function () {return pstr}
		};
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
		if (ostk[optr] !== 9) return;
		--nptr;--optr;
		return nstk[nptr] = "" + nstk[nptr] + nstk[nptr + 1];
	}
	function applyfunc (args) {
		if (ostk[optr] !== 8) return;
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

	var nstk = [], ostk = [], pastk = [1], nptr = -1, optr = -1, paptr = 0, omode = true, numstr, ii, tmp, tmp2, terminator;
	main:
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
				nstk[++nptr] = StringParser(tmp);
				omode = false;
			break;
			case "(":
				omode || (ostk[++optr] = 8);
				ostk[++optr] = 0;
				omode = true;
			break;
			case ")":
				omode && pastk[paptr]--;
				calcsign();
				calcplus();
				calcmul();
				calcpow();
				concat();
				optr--; 
				nptr -= ((tmp = pastk[paptr]) - 1);
				applyfunc(tmp);
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
					calcsign();
					calcplus();
					ostk[++optr] = 1;
					omode = true;
				}
			break;
			case "-":
				if (omode) {
					ostk[++optr] = 6;
				} else {
					calcsign();
					calcplus();
					ostk[++optr] = 2;
					omode = true;
				}
			break;
			case "*":
				calcsign();
				calcplus();
				calcmul();
				ostk[++optr] = 3;
				omode = true;
			break;
			case "/":
				calcsign();
				calcplus();
				calcmul();
				ostk[++optr] = 4;
				omode = true;
			break;
			case "&":
				calcsign();
				calcplus();
				calcmul();
				calcpow();
				concat();
				ostk[++optr] = 9;
				omode = true;
			break;
			case "^":
				calcsign();
				calcplus();
				calcmul();
				ostk[++optr] = 7;
				omode = true;
			break;
			case ",":
				omode && (nstk[++nptr] = null);
				calcsign(); calcplus(); calcmul(); calcpow();
				pastk[paptr]++;
				omode = true;
			break;
			case " ": case "\t": case "\n": break;
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
				nstk[++nptr] = __variables__[numstr];
				omode = false;
		}
	}
	calcsign(); calcplus(); calcmul(); calcpow(); concat();
	return nstk[0];
}
	
var __variables__ = {
	raw: function (str) {
		return str.raw;
	},
	eval: __expr_eval__
};