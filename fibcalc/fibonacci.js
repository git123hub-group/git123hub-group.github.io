function $(id) { // 不是 jQuery
	return document.getElementById(id);
}
var fib = function () {
	function get_exp (n) {
		for (var i = 0, j = 1; j < n; ++i, j *= 2) ;
		return i;
	};
	function _f (n) {
		if (1 / n === 0) { return Infinity; } // Infinity === 2e308
		var a = 0, b = 1, m = 0, c, d, e;
		for (var i = get_exp(n), p = Math.pow(2, i); i >= 0; i--) {
			d = a * (2 * b - a);
			e = a * a + b * b;
			a = d, b = e;
			if (p <= n) {
				c = a + b;
				a = b, b = c;
				n -= p;
			}
			p /= 2;
		}
		return a;
	}
	return function (n) {
		n = +n;
		if (!(n < 0)) return _f(n);
		if (n % 2 === 0) return -_f(-n);
		return _f(-n);
	}
} ();
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"100"},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"32"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='https://git123hub.github.io/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
