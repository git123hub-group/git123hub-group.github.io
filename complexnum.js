var hypot = Math.hypot || function() {
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
var clz32 = Math.clz32 || (function () {
  'use strict';

  var table = [
    32, 31,  0, 16,  0, 30,  3,  0, 15,  0,  0,  0, 29, 10,  2,  0,
     0,  0, 12, 14, 21,  0, 19,  0,  0, 28,  0, 25,  0,  9,  1,  0,
    17,  0,  4,   ,  0,  0, 11,  0, 13, 22, 20,  0, 26,  0,  0, 18,
     5,  0,  0, 23,  0, 27,  0,  6,  0, 24,  7,  0,  8,  0,  0,  0]

  // Adapted from an algorithm in Hacker's Delight, page 103.
  return function (x) {
    // Note that the variables may not necessarily be the same.

    // 1. Let n = ToUint32(x).
    var v = Number(x) >>> 0

    // 2. Let p be the number of leading zero bits in the 32-bit binary representation of n.
    v |= v >>> 1
    v |= v >>> 2
    v |= v >>> 4
    v |= v >>> 8
    v |= v >>> 16
    v = table[Math.imul(v, 0x06EB14F9) >>> 26]

    // Return p.
    return v
  }
})();
function $(id) { // 不是 jQuery
	return document.getElementById(id);
}
var q1 = $("p1"),q2 = $("p2"),q3 = $("p3"),q4 = $("p4"),q5 = $("p5"),q6 = $("p6");
function cmplx_add (a, b, c, d, e, f) {
	e.value = +a.value + +c.value, f.value = +b.value + +d.value;
}
function cmplx_sub (a, b, c, d, e, f) {
	e.value = a.value - c.value, f.value = b.value - d.value;
}
function cmplx_mul (a, b, c, d, e, f) {
	a = a.value, b = b.value, c = c.value, d = d.value;
	e.value = a*c - b*d, f.value = a*d + b*c;
}
function cmplx_div (a, b, c, d, e, f) {
	a = a.value, b = b.value, c = c.value, d = d.value;
	var dvs = c * c + d * d;
	e.value = (a*c + b*d) / dvs, f.value = (b*c - a*d) / dvs;
}
function cmplx_recip (a, b, c, d) {
	a = +a.value, b = +b.value;
	var e = a*a + b*b;
	c.value =  a / e;
	d.value = -b / e;
}
function cmplx_sqr (a, b, c, d) {
	a = +a.value, b = +b.value;
	c.value = a*a - b*b;
	d.value = 2 * a * b;
}
function cmplx_sqrt (a, b, c, d) {
	a = +a.value, b = +b.value;
	var e = hypot(a, b);
	c.value = (a <= 0 && b === 0) ? 0 : Math.sqrt((e + a) / 2);
	d.value = (b >= 0 ? 1 : -1) * Math.sqrt((e - a) / 2);
}
function cmplx_ident (a, b, c, d) {
	c.value = +a.value, d.value = +b.value;
}
function from_cis (a, b, c, d) {
	a = +a.value, b = +b.value;
	c.value = a * Math.cos(b);
	d.value = a * Math.sin(b);
}
function from_cis2 (a, b, c, d) {
	a = +a.value, b = +b.value;
	c.value = Math.exp(a) * Math.cos(b);
	d.value = Math.exp(a) * Math.sin(b);
}
function to_cis (a, b, c, d) {
	a = +a.value, b = +b.value;
	c.value = hypot(a, b);
	d.value = Math.atan2(b, a);
}
function to_cis2 (a, b, c, d) {
	a = +a.value, b = +b.value;
	c.value = Math.log(hypot(a, b));
	d.value = Math.atan2(b, a);
}
function cmplx_pow (a, b, c, d, x, y) {
	var e = +a.value, f = +b.value; c = +c.value, d = +d.value
	var i, j, m, n, p, q, tp;
	if (d === 0) {
		switch (true) {
			case c === -1: return cmplx_recip (a, b, x, y);
			case c === 0: return x.value = 1, y.value = 0;
			case c === 0.5: return cmplx_sqrt (a, b, x, y);
			case c === 1: return cmplx_ident (a, b, x, y);
			case c === 2: return cmplx_sqr (a, b, x, y);
			case c | 0 === c && c > 2:
				m = e, n = f;
				for (i = 30 - clz32(c); i >= 0; i--) {
					p = m*m - n*n, q = 2*m*n;
					if ((c & (1 << i)) !== 0) {
						tp = p*e - q*f, q = p*f + q*e, p = tp; 
					}
					m = p, n = q;
				}
			return x.value = m, y.value = n;
		}
	}
	var g = Math.log(hypot(e, f)), h = Math.atan2(f, e);
	i = g * c + h * d, j = h * c - g * d;
	x.value = Math.exp(i) * Math.cos(j);
	y.value = Math.exp(i) * Math.sin(j);
}