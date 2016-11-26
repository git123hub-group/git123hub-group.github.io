/* exec-expr-1-multi1.js */

var mainprog, clinenum, breakpt, delayf, parsed = false, outHtml, changed, tmpnl, tlines, callstack, callptr, stack, running, tmpline;

function click1 () {
	var tmp;
	clinenum = 0;
	mainprog = $("box1").value.split("\n");
	breakpt = false;
	delayf = false;
	running = false;
	parsed = true;
	$("odoc1").innerHTML = outHtml = "";
	changed = false;
	tlines = mainprog.length;
	__user_vars__ = {};
	callstack = stack = [], callptr = 0;
	for (var i = 0, len = mainprog.length; i < len; ++i) {
		tmp = mainprog[i];
		tmp.charAt(0) === ":" && (__user_vars__["z" + tmp.slice(1)] = i);
	}
}

function click2 () { // 单步运行
	parsed || click1();
	stepinto();
	changed && ($("odoc1").innerHTML = outHtml);
	changed = false;
	breakpt = false;
}

function click3 () { // 运行 (直到断点)
	parsed || click1();
	running = true;
	while (!breakpt) stepinto();
	changed && ($("odoc1").innerHTML = outHtml);
	changed = false;
	breakpt = false;
	running && delayf && requestAnimationFrame(click3);
}

function stepinto () {
	try {
		var tmp;
		if ((tmpline = clinenum) >= tlines) { parsed = false; breakpt = true; delayf = false; return; }
		tmpnl = clinenum + 1;
		if ((tmp = mainprog[clinenum].charAt(0)) === "#" || tmp === ":") {
			++clinenum; return;
		}
		var prog = mainprog[clinenum];
		while ((tmp = mainprog[clinenum].match(/\\*$/)) && tmp[0].length % 2 === 1) { // repeat if contain line-continuation
			prog += "\n" + mainprog[++clinenum]; ++tmpnl;
		}
		__expr_eval__(prog);
		clinenum = tmpnl;
	} catch(error) {
		console.error(error); parsed = false; breakpt = true; delayf = false;
	}
}

!function(__variables__) {
	__variables__.print = function(str) {
		outHtml += escapeHTML(str);
		changed = true;
	};

	__variables__.println = function(str) {
		outHtml += escapeHTML(str) + "\n";
		changed = true;
	};

	__variables__.printf = function() {
		outHtml += escapeHTML(sprintf.apply(null, arguments));
		changed = true;
	};

	__variables__.sprintf = function() {
		return sprintf.apply(null, arguments);
	};

	__variables__.clear = function(str) {
		outHtml = "";
		changed = true;
	};

	__variables__.breakpoint = function() {
		breakpt = true; delayf = false;
	};

	__variables__.jump = function(obj) {
		if (typeof obj === "string") {
			tmpnl = __user_vars__["z" + obj];
		} else if (typeof obj === "number") {
			tmpnl = tmpline + obj;
		}
	};

	__variables__.jumpc = function(obj, cond) {
		cond && __variables__.jump(obj)
	};

	__variables__.call = function(obj) {
		callstack[callptr++] = tmpnl;
		if (typeof obj === "string") {
			tmpnl = __user_vars__["z" + obj];
		} else if (typeof obj === "number") {
			tmpnl = tmpline + obj;
		}
	};

	__variables__["return"] = function() {
		if (callptr === 0) { parsed = false; breakpt = true; delayf = false; return; }
		tmpnl = callstack[--callptr];
	}

	__variables__.nextframe = function() {
		breakpt = delayf = true;
	};

	/*---------------------------------------- 数学函数区开始 ----------------------------------------*/

	__variables__.sin = Math.sin;

	__variables__.sinh = Math.sinh || function(x) {
		return (Math.exp(x) - Math.exp(-x)) / 2;
	};

	__variables__.asin = Math.asin;

	__variables__.asinh = Math.asinh || function(x) {
		sgn = 1;
		x < 0 && (x = -x, sgn = -1);
		return sgn * Math.log(x + Math.sqrt(x * x + 1));
	};

	__variables__.cos = Math.cos;

	__variables__.cosh = Math.cosh || function(x) {
		return (Math.exp(x) + Math.exp(-x)) / 2;
	};

	__variables__.acos = Math.acos;

	__variables__.acosh = Math.acosh || function(x) {
		return Math.log(x + Math.sqrt(x * x - 1));
	};

	__variables__.tan = Math.tan;

	__variables__.tanh = Math.tanh || function(x) {
		if (x === Infinity) return 1; else if (x === -Infinity) return -1; else return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	};

	__variables__.atan = Math.atan;

	__variables__.atan2 = Math.atan2;

	__variables__.atanh = Math.atanh || function(x) {
		sgn = 1;
		x < 0 && (x = -x, sgn = -1);
		return sgn * Math.log((1 + x) / (1 - x)) / 2;
	};

	__variables__.cot = function(x) {
		return 1 / Math.tan(x);
	};

	__variables__.coth = function(x) {
		return 1 / __variables__.tanh(x);
	};

	__variables__.acot = function(x) {
		return Math.atan(1 / x);
	};

	__variables__.acoth = function(x) {
		return __variables__.atanh(1 / x);
	};

	__variables__.sqr = function(x) {
		return x * x;
	};

	__variables__.sqrt = Math.sqrt;

	__variables__.ln = Math.log;

	__variables__.log = function(x, b) {
		b || (b = 10);
		return Math.log(x) / Math.log(b);
	};

	__variables__.log1p = Math.log1p || function(x) {
		return Math.log(x) + 1;
	};

	__variables__.log2 = Math.log2 || function(x) {
		return Math.log(x) * Math.LOG2E;
	};

	__variables__.lg = __variables__.log10 = Math.log10 || function(x) {
		return Math.log(x) * Math.LOG10E;
	};

	__variables__.exp = Math.exp;

	__variables__.expm1 = Math.expm1 || function(x) {
		return Math.exp(x) - 1;
	};

	__variables__.pow = Math.pow;

	__variables__.mod = function(x, y) {
		return x % y;
	};

	__variables__.quotient = function(x, y) {
		return (x - x % y) / y;
	};

	__variables__.abs = function(x) {
		return x >= 0 ? x : -x;
	};

	__variables__.sign = Math.sign || function(x) {
		x = +x;
		if (x === 0 || isNaN(x)) {
			return Number(x);
		}
		return x > 0 ? 1 : -1;
	};

	__variables__.ident = function(x) {
		return x;
	};

	__variables__.neg = function(x) {
		return -x;
	};

	__variables__.recip = function(x) {
		return 1 / x;
	};

	__variables__.zero = function() {
		return 0;
	};

	__variables__.one = function() {
		return 1;
	};

	__variables__.floor = Math.floor;

	__variables__.ceil = Math.ceil;

	__variables__.trunc = Math.trunc || function(x) {
		return x - x % 1;
	};

	__variables__.round = Math.round;

	__variables__.hypot = Math.hypot || function() {
		var y = 0;
		var length = arguments.length;
		for (var i = 0; i < length; i++) {
			if (arguments[i] === Infinity || arguments[i] === -Infinity) {
				return Infinity;
			}
			y += arguments[i] * arguments[i];
		}
		return Math.sqrt(y);
	};

	__variables__.erf = function(b) { // approximation
		var c = .140012;
		var d = b * b;
		var f = (4 / Math.PI + c * d) / (1 + c * d);
		return __variables__.sign(b) * Math.sqrt(1 - Math.exp(-d * f));
	};

	__variables__.max = Math.max;

	__variables__.min = Math.min;

	__variables__.and = function(a, b) {
		return a && b;
	};

	__variables__.bit_and = function(a, b) {
		return a & b;
	};

	__variables__.or = function(a, b) {
		return a || b;
	};

	__variables__.bit_or = function(a, b) {
		return a | b;
	};

	__variables__.not = function(x) {
		return !x;
	};

	__variables__.bit_not = function(x) {
		return ~x;
	};

	__variables__.bit_xor = function(a, b) {
		return a ^ b;
	};

	__variables__["if"] = function(a, b, c) {
		return a ? b : c;
	};

	__variables__.bit_sal = __variables__.bit_shl = function(a, b) {
		return a << b;
	};

	__variables__.bit_sar = function(a, b) {
		return a >>> b;
	};

	__variables__.bit_shr = function(a, b) {
		return a >> b;
	};

	__variables__.equ = function(a, b) {
		return a === b;
	};

	__variables__.neq = function(a, b) {
		return a !== b;
	};

	__variables__.lss = function(a, b) {
		return a < b;
	};

	__variables__.leq = function(a, b) {
		return a <= b;
	};

	__variables__.gtr = function(a, b) {
		return a > b;
	};

	__variables__.geq = function(a, b) {
		return a >= b;
	};

	__variables__.pi = Math.PI;

	__variables__.e = Math.E;

	__variables__.phi = (Math.sqrt(5) + 1) / 2;

	__variables__.infinity = __variables__.Infinity = Infinity;

	__variables__.NaN = NaN;

	__variables__["true"] = true;

	__variables__["false"] = false;

	__variables__["null"] = null;

	__variables__["undefined"] = undefined;

	__variables__.random = Math.random;

	/*---------------------------------------- 数学函数区结束 ----------------------------------------*/

	__variables__.alert = function(a) {
		alert(a);
	};

	__variables__.confirm = function(a) {
		confirm(a);
	};

	__variables__.prompt = function(a, b) {
		prompt(a, b);
	};

	__variables__.noop = function(){};

	__variables__.escape = escapeHTML;

	__variables__.unescape = function(e){var t={amp:"&",lt:"<",gt:">",quot:'"'};return(""+e).replace(/&([^;]+);/g,function(e,n){return"#"!==n.charAt(0)?t[n]:"x"!==n.charAt(1).toLowerCase()?String.fromCharCode(n.slice(1)):String.fromCharCode(parseInt(n.slice(2),16))})};

	__variables__.beginCSS = function (str) {
		outHtml += '<span style="' + escapeHTML(str) + '">';
	}
	__variables__.endCSS = function () {
		outHtml += '</span>';
	}
	__variables__.multiline = function (l, l2) {
		var str = "";
		for (var i = l; i > 0; i--, ++tmpnl) {
			str += mainprog[tmpnl] + ((l2 || i > 1) && "\n");
		}
		return str;
	}

	__variables__.assign = function(varn, value) { // usage: assign("variable name", value) or variable name = value
		return __user_vars__["x" + varn] = value;
	};

	__variables__["delete"] = function(a) {
		return delete __user_vars__["x" + a];
	};

	__variables__.indirect = function(a) { // usage: indirect("variable name") or (variable name)
		return (tmp2 = __user_vars__["x" + a]) == null ? __variables__[a] : tmp2;
	};

	__variables__.arglen = function() {
		return arguments.length;
	};

	__variables__.argjoin = function(sep) {
		return Array.prototype.slice.call(arguments, 1).join(sep);
	};

	__variables__.array = Array.of || function() {
		return Array.prototype.slice.call(arguments);
	};

	__variables__.regex = RegExp;

	__variables__.chr = String.fromCharCode;

	__variables__.ord = function(a, b) {
		return ("" + a).charCodeAt(b);
	};

	__variables__.baseconvert = function (int_, f, t) {
		return parseInt(int_, f).toString(t);
	}

	__variables__.method = function(obj, mthd) {
		if (obj == null || obj[mthd] === Function) return; // Function.prototype.constructor.call(Function.prototype, string) ==> Function(string) 出现漏洞
		return obj[mthd].apply(obj,Array.prototype.slice.call(arguments, 2));
	};
}(__variables__);