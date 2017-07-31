// <![CDATA[
function $(id) { // 不是 jQuery
	return document.getElementById(id);
}
var acccalc = document.createElement("script");
acccalc.src = "bignumber.min.js";
document.body.appendChild(acccalc);
acccalc.onload = function () {
	BigNumber.set({ DECIMAL_PLACES: 30, EXPONENTIAL_AT: [-20, 20] });
}
function cf2frac (cf) {
	var a = 0, b = 1, c = 1, d = 0, e, f;
	for (var i = 0, j = cf.length; i < j; ++i) {
		e = c * +cf[i] + a, f = d * +cf[i] + b;
		a = c, b = d, c = e, d = f;
	}
	return [c, d]
}
function frac2cf (fr) {
	var cf = [];
	var a = +fr[0], b = +fr[1], c;
	while (b !== 0) {
		c = a % b
		cf.push ( (a - c) / b );
		a = b, b = c;
	}
	return cf;
}
function frac2dec (fr) {
	return new BigNumber(fr[0]).div(new BigNumber(fr[1]));
}
function dec2frac (dec) {
	return new BigNumber(dec).toFraction(1e15);
}
function btn1 () {
	var b;
	if (!/(\d+[ ,;]*)+/.test(b = $("p1").value)) { return alert("不是有效的连分数") }
	var a = cf2frac(b.trim().split(/\s*[,; ]\s*/));
	$("p2").value = a[0]; $("p3").value = a[1];
}
function btn2 () {
	var a = $("p2").value.replace(/[ ,']/g, "");
	var b = $("p3").value.replace(/[ ,']/g, "");
	var re = /\d+/
	if (!re.test(a) || !re.test(b)) { return alert("不是有效的分数") }
	$("p1").value = frac2cf([a, b]).join(", ").replace(",", ";");
}
function btn3 () {
	var a = $("p2").value.replace(/[ ,']/g, "");
	var b = $("p3").value.replace(/[ ,']/g, "");
	var re = /\d+/
	if (!re.test(a) || !re.test(b)) { return alert("不是有效的分数") }
	$("p4").value = frac2dec([a, b]);
}
function perc2dec (a) {
	a = a.replace(/^\s*|\s*%\s*$/g, "");
	var dpp = a.indexOf(".");
	dpp < 0 && (dpp = a.length);
	if (dpp < 2) a = "0.0" + (dpp < 1 ? "0" : a.charAt(0)) + a.slice(dpp + 1);
	else a = (dpp < 3 ? 0 : a.slice(0,dpp - 2)) + "." + a.substr(dpp - 2, 2) + a.slice(dpp + 1);
	return a.replace(/\.?0*$/, "").replace(/0*(\d(?:.|$))/, "$1");
}
function dec2perc (a) {
	var sp = a.split(".");
	if (sp.length < 2) { sp[1] = "" }
	sp[0] = sp[0].replace(/^0*/, "");
	sp[1] = sp[1].replace(/0*$/, "");
	while (sp[1].length < 2) { sp[1] += "0"; }
	var sp0 = sp[0];
	var sp1 = sp[1].slice(0,2);
	var ip = sp0 + (sp0 === "" ? sp1.replace(/^0/, "") : sp1);
	var fp = sp[1].slice(2);
	fp === "" || (fp = "." + fp);
	return ip + fp + "%";
}
function btn4 () {
	var a = $("p4").value.trim();
	var pc = /%/.test(a);
	try {
		pc && (a = perc2dec(a));
		var b = dec2frac(a);
	} catch (err) {
		return alert("不是有效的小数/百分数")
	}
	$("p2").value = b[0]; $("p3").value = b[1];
}
function btn5 () {
	var a = $("p4").value.trim();
	var pc = /%/.test(a);
	$("p4").value = pc ? perc2dec(a) : dec2perc(a);
}
// ]]>