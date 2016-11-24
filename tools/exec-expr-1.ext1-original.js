function click1() {
    var str = $("inexpr").value, vn;
    var eqpos = str.indexOf("="), result;
    try {
        if (eqpos >= 0) {
            vn = str.slice(0, eqpos).trim().replace(/[^\w\$]/);
            result = __expr_eval__(str.slice(eqpos + 1));
            if (vn !== "raw" && vn !== "eval" && vn !== "delete") __variables__[vn] = result;
        } else {
            result = __expr_eval__(str);
        }
        $("outexpr").innerHTML = "<span class='success'>" + escapeHTML(result) + "</span>";
    } catch (err) {
        $("outexpr").innerHTML = "<span class='error'>错误: " + escapeHTML(err) + "</span>";
    }
    changed && ($("outdoc").innerHTML = Ostr);
}

var changed = false, Ostr = "";

__variables__.print = function(str) {
    Ostr += escapeHTML(str);
    changed = true;
};

__variables__.println = function(str) {
    Ostr += escapeHTML(str) + "\n";
    changed = true;
};

__variables__.clear = function(str) {
    Ostr = "";
    changed = true;
};

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
    return x < 0 ? x : -x;
};

__variables__.sign = Math.sign || function(x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
        return Number(x);
    }
    return x > 0 ? 1 : -1;
};

__variables__.firstarg = __variables__.ident = function(x) {
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

__variables__.erf = function(b) {
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
    location.href = a;
};

__variables__.len = function(a) {
    return ("" + a).length;
};

__variables__.replaceall = function(a, b, c) {
    return ("" + a).split(b).join(c);
};

__variables__.chr = function(a) {
    String.fronCharCode(a);
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

__variables__.indirect = function(a) {
    return __variables__[a];
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

__variables__["delete"] = function(a) {
    if (a !== "raw" && a !== "eval" && a !== "delete") return delete __variables__[a];
    return false;
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