function click1() {
	var str = $("inexpr").value, vn;
	var /* eqpos = str.indexOf("="), */ result;
	try {
		result = __expr_eval__(str);
		$("outexpr").innerHTML = "<span class='success'>" + escapeHTML(result) + "</span>";
	} catch (err) {
		$("outexpr").innerHTML = "<span class='error'>错误: " + escapeHTML(err) + "</span>";
	}
	changed && ($("outdoc").innerHTML = Ostr);
}

var changed = false, Ostr = "";

!function(__variables__) {

__variables__.print = function(str) {
	Ostr += escapeHTML(str);
	changed = true;
};

__variables__.println = function(str) {
	Ostr += escapeHTML(str) + "\n";
	changed = true;
};

__variables__.printf = function() {
	Ostr += escapeHTML(sprintf.apply(null, arguments));
	changed = true;
};

__variables__.sprintf = function() {
	return sprintf.apply(null, arguments);
};

__variables__.clear = function(str) {
	Ostr = "";
	changed = true;
};

/*---------------------------------------- 数学函数区开始 ----------------------------------------*/

__variables__.sin = Math.sin;

__variables__.sinh = Math.sinh || function(x) {
	return (Math.exp(x) - Math.exp(-x)) / 2;
};

__variables__.qexp = function(x, b) {
	return 2 * __variables__.sinh(b ? x * Math.log(b) : x);
};

__variables__.asin = Math.asin;

__variables__.asinh = Math.asinh || function(x) {
	sgn = 1;
	x < 0 && (x = -x, sgn = -1);
	return sgn * Math.log(x + Math.sqrt(x * x + 1));
};

__variables__.qlog = function(x, b) {
	var tmp = __variables__.asinh(x / 2);
	return b ? tmp / Math.log(b) : tmp;
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

__variables__.cube = function(x) {
	return x * x * x;
};

__variables__.cbrt = Math.cbrt || function(x) {
	var y = Math.pow(Math.abs(x), 1/3);
	return x < 0 ? -y : y;
};

__variables__.ln = Math.log;

__variables__.log = function(x, b) {
	return b ? Math.log(x) / Math.log(b) : Math.log(x);
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

__variables__.clz32 = Math.clz32 || function(value) {
	var value = Number(value) >>> 0;
	return value ? 32 - value.toString(2).length : 32;
}

__variables__.fib = function(n) {
	var a = 0, b = 1, tmp, sgn = n % 2 === 0 ? -1 : 1;
	n < 0 ? (n = -n) : sgn = 1;
	if (n < 2) return n;
	if (n > 1476) return NaN;
	for (; n > 1; n--) {
		tmp = a + b;
		a = b, b = tmp;
	}
	return b * sgn;
};

__variables__.imul = Math.imul || function(a, b) {
	var ah = (a >>> 16) & 0xffff;
	var al = a & 0xffff;
	var bh = (b >>> 16) & 0xffff;
	var bl = b & 0xffff;
	// the shift by 0 fixes the sign on the high part
	// the final |0 converts the unsigned value into a signed value
	return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
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

__variables__.href = function(a) {
	location.href = (""+a).replace(/^\s*javascript:([\s\S]*)$/i, function ($0, $1) {
		return "https://javascript-evaluator.github.io/#=#" + encodeURIComponent($1) + '#location.href = "' + location.href.replace(/[\\"]/g, "\\$&") + '";';
	});
};

__variables__.len = function(a) {
	return ("" + a).length;
};

__variables__.replaceall = function(a, b, c) {
	return ("" + a).split(b).join(c);
};

__variables__.chr = function(a) {
	return String.fromCharCode(a);
};

__variables__.ord = function(a) {
	return ("" + a).charCodeAt(0);
};

__variables__.index = function(a, b, c) {
	return ("" + a).indexOf(b, c);
};

__variables__.lastindex = function(a, b, c) {
	return ("" + a).lastIndexOf(b, c);
};

__variables__.reverse = function(a, b) {
	return ("" + a).split(b).reverse().join(b);
};

__variables__.substr = function(a, b, c) {
	return ("" + a).slice(b, c);
};

__variables__.toupper = function(a) {
	return ("" + a).toUpperCase();
};

__variables__.tolower = function(a) {
	return ("" + a).toLowerCase();
};

__variables__.isposzero = function(a) {
	return a === 0 && 1 / a > 0;
};

__variables__.isnegzero = function(a) {
	return a === 0 && 1 / a < 0;
};

__variables__.isposinf = function(a) {
	return typeof a === "number" && a > 0 && 1 / a === 0;
};

__variables__.isneginf = function(a) {
	return typeof a === "number" && a < 0 && 1 / a === 0;
};

__variables__.isNaN = function(a) {
	return a !== a;
};

__variables__.isnull = function(a) {
	return a === null;
};

__variables__.isundef = function(a) {
	return a === undefined;
};

__variables__.choose = function(n) {
	return n > 0 ? arguments[n] : null;
};

__variables__["typeof"] = function(a) {
	return typeof a;
};

__variables__.lastarg = function() {
	return arguments[arguments.length - 1];
};

__variables__.arglen = function() {
	return arguments.length;
};

__variables__.argjoin = function(sep) {
	return Array.prototype.slice.call(arguments, 1).join(sep);
};

__variables__.noop = function() {};

__variables__.now = Date.now || function() {
	return new Date().getTime();
};

__variables__.tostr = function(a) {
	return "" + a;
};

__variables__.tonum = function(a) {
	return +a;
};
 
__variables__.tobool = function(a) {
	return !!a;
};

__variables__.array = Array.of || function() {
	return Array.prototype.slice.call(arguments);
};

__variables__.split = function(str, sep, lim) {
	return ("" + str).split(sep);
};

__variables__.join = function(arr, sep) {
	return arr.join(sep);
};

__variables__.call = function(func, arg) {
	return func.apply(arg, Array.prototype.slice.call(arguments, 2));
};

__variables__.apply = function(func, arg, arg2) {
	return func.apply(arg, arg2);
};

__variables__.indirect = function(a) { // usage: indirect("variable name") or (variable name)
	return (tmp2 = __user_vars__["x" + a]) == null ? __variables__[a] : tmp2;
};

__variables__.assign = function(varn, value) { // usage: assign("variable name", value) or variable name = value
	return __user_vars__["x" + varn] = value;
};

__variables__["delete"] = function(a) {
	return delete __user_vars__["x" + a];
};

}(__variables__);